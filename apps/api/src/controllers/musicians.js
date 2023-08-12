const Event = require('../models/event')
const ExpressError = require('../lib/ExpressError')
const { Musician, StrayMusician } = require('../models/musician')
const { Venue } = require('../models/venue')
const { getUser } = require('../lib/utils')
const { streamUpload } = require('../config/cloudinary')

const EmailService = require('../services/email.service')
const debug = require('../lib/debug')

const createMusician = async (req, res) => {
  const musicianData = JSON.parse(req.body.musician)
  const { logo, gallery, songs } = req.files
  const { events, musician } = musicianData
  const user = await getUser(req)
  const newMusician = new Musician({
    ...musicianData,
    name: musician?._id ? musician.name : musician,
    user,
    events: [],
    profileStatus: 'pending',
  })

  const stray = musician._id ? await Musician.findById(musician._id) : null

  user.roles.push('Musician')

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
        organizer: stray || newMusician,
        name: stray?.name || newMusician.name,
      }

      await Venue.findByIdAndUpdate(venueId, {
        $push: { events: event },
      })

      eventList.push(event)
      newMusician.events.push(event)
    }
  )

  await Promise.all(createEvents)

  if (logo) {
    const uploadedLogo = await streamUpload(logo[0].buffer)
    debug.log('☁️ Uploaded file', logo[0].originalname)

    // save cloudinary URL and filepath in db
    newMusician.logo = {
      url: uploadedLogo.secure_url,
      filepath: uploadedLogo.public_id,
    }
  }

  if (gallery) {
    const uploadGallery = gallery.map(async (file) => {
      const uploadedFile = await streamUpload(file.buffer, 'test_user')
      debug.log('☁️ Uploaded file', file.originalname)

      newMusician.gallery.push({
        url: uploadedFile.secure_url,
        filepath: uploadedFile.public_id,
      })
    })

    await Promise.all(uploadGallery)
  }

  if (songs) {
    // upload songs
    const uploadSongs = songs.map(async (file) => {
      const uploadedFile = await streamUpload(file.buffer)
      debug.log('☁️ Uploaded audio🎵', file.originalname)

      newMusician.songs.push({
        url: uploadedFile.secure_url,
        filepath: uploadedFile.public_id,
      })
    })

    await Promise.all(uploadSongs)
  }

  if (musician._id) {
    const eventIds = eventList.map((e) => e._id)

    await Musician.findByIdAndUpdate(
      musician._id,
      {
        $unset: {
          _variant: 1,
        },
        $set: {
          ...musicianData,
          user,
          profileStatus: 'pending',
          songs: newMusician.songs,
          gallery: newMusician.gallery,
          logo: newMusician.logo,
          events: stray.events.concat(eventIds),
        },
      },
      {
        overwriteDiscriminatorKey: true,
      }
    )
  } else {
    await newMusician.save()
  }

  await Event.insertMany(eventList)
  await user.save()

  EmailService.sendNewMusicianEmail(newMusician)

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      roles: user.roles,
    },
  })
}

const getMusician = async (req, res) => {
  try {
    const { id } = req.params
    const foundMusician = await Musician.findById(id)

    res.json(foundMusician)
  } catch (err) {
    throw new ExpressError(404, 'Cannot find musician.')
  }
}

const search = async (req, res) => {
  const { name, state, city, genre } = req.query

  const musicians = await Musician.find({
    genre: genre ? { $regex: new RegExp(genre, 'i') } : { $ne: null },
    name: name ? { $regex: new RegExp(name, 'i') } : { $ne: null },
    'address.city': city ? { $regex: new RegExp(city, 'i') } : { $ne: null },
    'address.state': state || { $ne: null },
  })

  res.json(musicians)
}

const me = async (req, res) => {
  try {
    const user = await getUser(req)
    const foundMusician = await Musician.findOne({
      user: user._id,
    }).populate({ path: 'events', populate: { path: 'venue' } })

    res.json(foundMusician)
  } catch (err) {
    throw new ExpressError(404, 'Cannot find musician profile for this user.')
  }
}

const updateStatus = async (req, res) => {
  const { approve } = req.query
  const { id } = req.params

  const artist = await Musician.findById(id)

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

// stores copy of updated fields in revision
// to be reviewed by admin
const updateMusician = async (req, res) => {
  const { id } = req.params
  const musician = await Musician.findById(id)

  if (musician.profileStatus !== 'approved') {
    throw new ExpressError(401, 'Cannot update unapproved profile')
  }

  const musicianData = JSON.parse(req.body.musician)
  const { logo, gallery, songs } = req.files

  musician.revision = musicianData

  if (logo) {
    const uploadedLogo = await streamUpload(logo[0].buffer)
    debug.log('☁️ Uploaded file: ', logo[0].originalname)

    musician.revision.logo = {
      url: uploadedLogo.secure_url,
      filepath: uploadedLogo.public_id,
    }
  }

  if (gallery) {
    const galleryUploads = gallery.map(async (image) => {
      const uploadedFile = await streamUpload(image.buffer)
      debug.log('☁️ Uploaded file: ', image.originalname)

      musician.revision.gallery.push({
        url: uploadedFile.secure_url,
        filepath: uploadedFile.public_id,
      })
    })

    await Promise.all(galleryUploads)
  }

  if (songs) {
    const songUploads = songs.map(async (song) => {
      const uploadedFile = await streamUpload(song.buffer)
      debug.log('☁️ Uploaded audio🎵: ', song.originalname)

      musician.revision.songs.push({
        url: uploadedFile.secure_url,
        filepath: uploadedFile.public_id,
      })
    })
    await Promise.all(songUploads)
  }

  musician.save()
  res.json({ success: true })
}

const autocomplete = async (req, res) => {
  const musician = await Musician.aggregate([
    {
      $search: {
        index: 'musician-autocomplete',
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

  res.json(musician)
}

const createStray = async (req, res) => {
  const { name } = req.body

  const venue = await StrayMusician.create({
    name,
  })

  res.json(venue)
}

const strayAutocomplete = async (req, res) => {
  const musicians = await StrayMusician.aggregate([
    {
      $search: {
        index: 'musician-autocomplete',
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

  res.json(musicians)
}

module.exports = {
  createMusician,
  getMusician,
  search,
  me,
  updateStatus,
  updateMusician,
  autocomplete,
  createStray,
  strayAutocomplete,
}
