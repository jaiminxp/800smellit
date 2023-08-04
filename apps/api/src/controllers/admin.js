const User = require('../models/user')
const { Musician } = require('../models/musician')
const { Artist } = require('../models/artist')
const MusicianService = require('../services/musician.service')
const ArtistService = require('../services/artist.service')

async function getUsers(req, res) {
  const { email, status, roles } = req.query

  const query = {
    email: email ? { $regex: new RegExp(email, 'i') } : { $ne: null },
    isEmailVerified: status ? status === 'verified' : { $ne: null },
    roles: roles ? { $in: roles.split(',') } : { $ne: null },
  }

  const users = await User.find(query, 'email roles isEmailVerified')
  return res.json(users)
}

async function getPendingStatistics(req, res) {
  const musicians = await Musician.count({
    $or: [{ profileStatus: 'pending' }, { revision: { $ne: null } }],
  })
  const artists = await Artist.count({
    $or: [{ profileStatus: 'pending' }, { revision: { $ne: null } }],
  })

  return res.json({ musicians, artists })
}

async function getPendingMusicians(req, res) {
  const musicians = await Musician.find(
    { $or: [{ profileStatus: 'pending' }, { revision: { $ne: null } }] },
    'name genre band logo address revision'
  )

  return res.json(musicians)
}

async function getPendingArtists(req, res) {
  const artists = await Artist.find(
    { $or: [{ profileStatus: 'pending' }, { revision: { $ne: null } }] },
    'name genre address revision'
  )

  return res.json(artists)
}

async function updateMusicianStatus(req, res) {
  const { action } = req.body
  const { id } = req.params
  const musician = await Musician.findById(id).lean()

  let message = ''

  if (action === 'approve') {
    if (musician.revision) {
      // for profile update
      await MusicianService.approveUpdate(musician)
      message = 'Musician update approved'
    } else {
      // for new profile
      await Musician.findByIdAndUpdate(musician._id, {
        profileStatus: 'approved',
      })
      message = 'Musician approved'
    }
  } else if (action === 'reject') {
    if (musician.revision) {
      // reject profile update
      await MusicianService.rejectUpdate(musician)
      message = 'Musician update rejected'
    } else {
      // reject and delete profile
      await Musician.findByIdAndDelete(id)
      await User.findByIdAndUpdate(musician.user, {
        $pull: { roles: 'Musician' },
      })
      message = 'Musician rejected'
    }
  }

  res.status(200).send({ message })
}

async function updateArtistStatus(req, res) {
  const { action } = req.body
  const { id } = req.params
  const artist = await Artist.findById(id).lean()
  let message = ''

  if (action === 'approve') {
    if (artist.revision) {
      // for profile update
      ArtistService.approveUpdate(artist)
      message = 'Artist update approved'
    } else {
      // for new profile
      await Artist.findByIdAndUpdate(id, { profileStatus: 'approved' })
      message = 'Artist approved'
    }
  } else if (action === 'reject') {
    if (artist.revision) {
      // reject profile update
      ArtistService.rejectUpdate(artist)
      message = 'Artist update rejected'
    } else {
      // reject and delete profile
      await Artist.findByIdAndDelete(id)
      await User.findByIdAndUpdate(artist.user, {
        $pull: { roles: 'Artist' },
      })
      message = 'Artist rejected'
    }
  }

  res.status(200).send({ message })
}

async function getMusicianById(req, res) {
  const { id } = req.params
  const musician = await Musician.findById(id)
    .populate('events')
    .populate('user')

  if (musician.revision) {
    const { revision } = musician

    if (revision.gallery.length === 0) {
      delete revision.gallery
    }

    if (revision.songs.length === 0) {
      delete revision.songs
    }

    musician.revision = revision
  }

  res.json(musician)
}

async function getArtistById(req, res) {
  const { id } = req.params

  const artist = await Artist.findById(id).populate('events').populate('user')

  if (artist.revision) {
    const { revision } = artist

    if (revision.gallery.length === 0) {
      delete revision.gallery
    }

    artist.revision = revision
  }

  res.json(artist)
}

const searchMusicians = async (req, res) => {
  const { name, state, city, genre, status } = req.query

  const query = {
    name: name ? { $regex: new RegExp(name, 'i') } : { $ne: null },
    genre: genre ? { $regex: new RegExp(genre, 'i') } : { $ne: null },
    'address.city': city ? { $regex: new RegExp(city, 'i') } : { $ne: null },
    'address.state': state || { $ne: null },
    profileStatus: status ? { $in: status.split(',') } : { $ne: null },
  }

  const musicians = await Musician.find(query)

  res.send(musicians)
}

const searchArtists = async (req, res) => {
  const { name, state, city, genre, status } = req.query

  const query = {
    name: name ? { $regex: new RegExp(name, 'i') } : { $ne: null },
    genre: genre ? { $regex: new RegExp(genre, 'i') } : { $ne: null },
    'address.city': city ? { $regex: new RegExp(city, 'i') } : { $ne: null },
    'address.state': state || { $ne: null },
    profileStatus: status ? { $in: status.split(',') } : { $ne: null },
  }

  const artists = await Artist.find(query)

  res.send(artists)
}

const getUserById = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id, 'email isEmailVerified').lean()

  const musician = await Musician.findOne(
    { user: id },
    'name profileStatus'
  ).lean()

  const artist = await Artist.findOne({ user: id }, 'name profileStatus').lean()

  const response = {
    user,
    profiles: {
      musician,
      artist,
    },
  }

  res.json(response)
}

const getDashboardStats = async (req, res) => {
  const users = await User.count({})
  const musicians = await Musician.count({})
  const artists = await Artist.count({})

  const pendingMusicians = await Musician.count({
    $or: [{ profileStatus: 'pending' }, { revision: { $ne: null } }],
  })

  const pendingArtists = await Artist.count({
    $or: [{ profileStatus: 'pending' }, { revision: { $ne: null } }],
  })

  const response = {
    users,
    musicians,
    artists,
    pendingRequests: pendingMusicians + pendingArtists,
  }

  res.json(response)
}

module.exports = {
  getUsers,
  getPendingStatistics,
  getPendingMusicians,
  getPendingArtists,
  updateMusicianStatus,
  updateArtistStatus,
  getMusicianById,
  getArtistById,
  searchMusicians,
  searchArtists,
  getUserById,
  getDashboardStats,
}
