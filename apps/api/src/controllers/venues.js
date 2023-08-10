const { streamUpload } = require('../config/cloudinary')
const ExpressError = require('../lib/ExpressError')
const { getUser } = require('../lib/utils')
const { Venue, StrayVenue } = require('../models/venue')

const search = async (req, res) => {
  const { state, city, name } = req.query

  const venues = await Venue.find({
    name: name ? { $regex: new RegExp(name, 'i') } : { $ne: null },
    'address.city': city ? { $regex: new RegExp(city, 'i') } : { $ne: null },
    'address.state': state || { $ne: null },
  }).populate('events')

  res.json(venues)
}

const create = async (req, res) => {
  const venueData = JSON.parse(req.body.venue)
  const { gallery } = req.files
  const user = await getUser(req)

  const {
    address,
    state,
    city,
    coordinates,
    contactName,
    contactPhone,
    contactEmail,
    venue,
    ...rest
  } = venueData

  const venueGallery = []

  if (gallery) {
    const galleryUploads = gallery.map(async (file) => {
      const uploadedFile = await streamUpload(file.buffer, 'test_user')
      console.log('☁️ Uploaded file', file.originalname)

      venueGallery.push({
        url: uploadedFile.secure_url,
        filepath: uploadedFile.public_id,
      })
    })

    await Promise.all(galleryUploads)
  }

  if (venue._id) {
    const claimedVenue = await Venue.findByIdAndUpdate(
      venue._id,
      {
        $unset: {
          _variant: 1,
        },
        $set: {
          ...rest,
          user,
          gallery: venueGallery,
          contact: {
            name: contactName,
            phone: contactPhone,
            email: contactEmail,
          },
        },
      },
      { overwriteDiscriminatorKey: true, new: true }
    )

    return res.json(claimedVenue)
  }

  const newVenue = new Venue({
    ...rest,
    name: venue,
    user,
    gallery: venueGallery,
    contact: {
      name: contactName,
      phone: contactPhone,
      email: contactEmail,
    },
    address: {
      address,
      state,
      city,
    },
    geometry: {
      type: 'Point',
      coordinates,
    },
  })

  await newVenue.save()
  return res.json(newVenue)
}

const me = async (req, res) => {
  const user = await getUser(req)

  const venues = await Venue.find({
    user: user._id,
  }).populate({ path: 'events', populate: { path: 'venue' } })

  res.json(venues)
}

const update = async (req, res) => {
  const { id } = req.params
  const prevVenue = await Venue.findById(id)

  if (!prevVenue) {
    throw new ExpressError('Cannot find venue', 401)
  }

  const {
    coordinates,
    address,
    state,
    city,
    contactName,
    contactEmail,
    contactPhone,
    venue,
    ...venueData
  } = JSON.parse(req.body.venue)
  const { gallery } = req.files

  const newGallery = []
  if (gallery) {
    const galleryUploads = gallery.map(async (image) => {
      const uploadedFile = await streamUpload(image.buffer)
      console.log('☁️ Uploaded file: ', image.originalname)

      newGallery.push({
        url: uploadedFile.secure_url,
        filepath: uploadedFile.public_id,
      })
    })

    await Promise.all(galleryUploads)
  }

  const nextVenue = await Venue.findByIdAndUpdate(
    id,
    {
      $set: {
        ...venueData,
        name: venue,
        gallery: newGallery.length > 0 ? newGallery : prevVenue.gallery,
        'geometry.coordinates': coordinates,
        address: {
          address,
          state,
          city,
        },
        contact: {
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
        },
      },
    },
    { new: true }
  )

  res.json(nextVenue)
}

const del = async (req, res) => {
  const { id } = req.params
  const deletedVenue = await Venue.findByIdAndRemove(id)
  res.json(deletedVenue)
}

const autocomplete = async (req, res) => {
  const venues = await Venue.aggregate([
    {
      $search: {
        index: 'venue-autocomplete',
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

  res.json(venues)
}

const findById = async (req, res) => {
  const { id } = req.params
  const venue = await Venue.findById(id)
  res.json(venue)
}

const createStray = async (req, res) => {
  const { address, state, city, coordinates, ...data } = req.body

  const venue = await StrayVenue.create({
    ...data,
    address: {
      address,
      state,
      city,
    },
    geometry: {
      type: 'Point',
      coordinates,
    },
  })

  res.json(venue)
}

const strayAutocomplete = async (req, res) => {
  const venues = await StrayVenue.aggregate([
    {
      $search: {
        index: 'venue-autocomplete',
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

  res.json(venues)
}

module.exports = {
  search,
  create,
  me,
  update,
  del,
  autocomplete,
  findById,
  createStray,
  strayAutocomplete,
}
