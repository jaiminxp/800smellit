const Event = require('../models/event')
const { Artist, StrayArtist } = require('../models/artist')
const { Venue } = require('../models/venue')
const ExpressError = require('../lib/ExpressError')
const { getUser } = require('../lib/utils')
const { streamUpload } = require('../config/cloudinary')
const EmailService = require('../services/email.service')

const createArtist = async (req, res) => {
  const artistData = JSON.parse(req.body.artist)
  const { gallery } = req.files
  const { events, artist } = artistData
  const user = await getUser(req)

  const newArtist = new Artist({
    ...artistData,
    name: artist?._id ? artist.name : artist,
    user,
    events: [],
    profileStatus: 'pending',
  })

  const stray = artist._id ? await Artist.findById(artist._id) : null

  const eventList = []

  const createEvents = events.map(
    async ({ date, time, venue: venueId, ...eventBody }) => {
      let eventDate = ''

      if (time) {
        eventDate = new Date(`${time} ${date}`)
      } else {
        eventDate = new Date(date)
      }

      const event = new Event({
        ...eventBody,
        venue: venueId,
        date: eventDate,
      })

      event.organizerType = 'Musician'
      event.organizerInfo = {
        organizer: stray || newArtist,
        name: stray?.name || newArtist.name,
      }

      Venue.findByIdAndUpdate(venueId, {
        $push: { events: event },
      })

      eventList.push(event)
      newArtist.events.push(event)
    }
  )

  newArtist.events = eventList

  if (gallery) {
    const uploadGallery = gallery.map(async (file) => {
      const uploadedFile = await streamUpload(file.buffer, 'test_user')
      console.log('☁️ Uploaded file', file.originalname)

      newArtist.gallery.push({
        url: uploadedFile.secure_url,
        filepath: uploadedFile.public_id,
      })
    })

    await Promise.all(uploadGallery)
  }

  if (artist._id) {
    const eventIds = eventList.map((e) => e._id)

    await Artist.findByIdAndUpdate(
      artist._id,
      {
        $unset: {
          _variant: 1,
        },
        $set: {
          ...artistData,
          user,
          profileStatus: 'pending',
          gallery: newArtist.gallery,
          events: stray.events.concat(eventIds),
        },
      },
      {
        overwriteDiscriminatorKey: true,
      }
    )
  } else {
    await newArtist.save()
  }

  user.roles.push('Artist')

  await Promise.all(createEvents)
  await Event.insertMany(eventList)
  await user.save()

  EmailService.sendNewArtistEmail(newArtist)

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles,
    },
  })
}

const getArtist = async (req, res, next) => {
  try {
    const { id } = req.params
    const foundArtist = await Artist.findById(id)

    res.json(foundArtist)
  } catch (err) {
    next(new ExpressError('Cannot find artist profile.', 404))
  }
}

const search = async (req, res) => {
  const { name, state, city, genre } = req.query

  const artists = await Artist.find({
    genre: genre ? { $regex: new RegExp(genre, 'i') } : { $ne: null },
    name: name ? { $regex: new RegExp(name, 'i') } : { $ne: null },
    'address.city': city ? { $regex: new RegExp(city, 'i') } : { $ne: null },
    'address.state': state || { $ne: null },
  })

  res.json(artists)
}

const me = async (req, res, next) => {
  try {
    const user = await getUser(req)
    const foundArtist = await Artist.findOne({
      user: user._id,
    }).populate({ path: 'events', populate: { path: 'venue' } })

    res.json(foundArtist)
  } catch (err) {
    next(new ExpressError('Cannot find artist profile for this user.', 404))
  }
}

const updateStatus = async (req, res) => {
  const { approve } = req.query
  console.log(req.query)
  const { id } = req.params

  const artist = await Artist.findById(id)

  if (approve === 'true') {
    if (artist.profileStatus === 'approved') {
      res.status(400).send('Profile is already approved')
    }

    artist.profileStatus = 'approved'
    await artist.save()
    res.render('message', { message: 'Thanks for approving the profile!' })
  } else if (approve === 'false') {
    if (artist.profileStatus === 'rejected') {
      res.status(400).send('Profile is already rejected')
    }

    artist.profileStatus = 'rejected'
    await artist.save()
    res.render('message', { message: 'Profile has been rejected' })
  } else {
    throw new ExpressError(400, 'Bad request.')
  }
}

const updateArtist = async (req, res) => {
  const { id } = req.params
  const artist = await Artist.findById(id)

  if (artist.profileStatus !== 'approved') {
    throw new ExpressError('Cannot update unapproved profile', 401)
  }

  const artistData = JSON.parse(req.body.artist)
  const { gallery } = req.files

  artist.revision = artistData

  if (gallery) {
    const galleryUploads = gallery.map(async (image) => {
      const uploadedFile = await streamUpload(image.buffer)
      console.log('☁️ Uploaded file: ', image.originalname)

      artist.revision.gallery.push({
        url: uploadedFile.secure_url,
        filepath: uploadedFile.public_id,
      })
    })
    await Promise.all(galleryUploads)
  }

  artist.save()
  res.json({ success: true })
}

const autocomplete = async (req, res) => {
  const artists = await Artist.aggregate([
    {
      $search: {
        index: 'artist-autocomplete',
        autocomplete: {
          query: `${req.query.query || ' '}`,
          path: 'name',
          fuzzy: {
            maxEdits: 1,
            prefixLength: 1,
            maxExpansions: 256,
          },
        },
      },
    },
  ])
    .limit(5)
    .project('name')

  res.json(artists)
}

const createStray = async (req, res) => {
  const { name } = req.body

  const artist = await StrayArtist.create({
    name,
  })

  res.json(artist)
}

const strayAutocomplete = async (req, res) => {
  const artists = await StrayArtist.aggregate([
    {
      $search: {
        index: 'artist-autocomplete',
        autocomplete: {
          query: `${req.query.query || ' '}`,
          path: 'name',
          fuzzy: {
            maxEdits: 1,
            prefixLength: 1,
            maxExpansions: 256,
          },
        },
      },
    },
  ])
    .limit(5)
    .project('name')

  res.json(artists)
}

module.exports = {
  createArtist,
  getArtist,
  getArtists: search,
  me,
  updateStatus,
  updateArtist,
  autocomplete,
  createStray,
  strayAutocomplete,
}
