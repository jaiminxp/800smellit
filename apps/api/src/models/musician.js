const mongoose = require('mongoose')
const addressSchema = require('./schemas/address')
const cloudAssetSchema = require('./schemas/cloud-asset')
const Event = require('./event')
const User = require('./user')
const { profileStatuses } = require('../seeds/seedHelpers')
const { cloudinary } = require('../config/cloudinary')
const debug = require('../lib/debug')

const { Schema } = mongoose

// user can update these fields
const musicianSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    website: String,
    phone: String,
    influences: String,
    address: {
      type: addressSchema,
      required: true,
    },
    band: String,
    logo: cloudAssetSchema,
    gallery: [cloudAssetSchema],
    songs: [cloudAssetSchema],
    members: [
      {
        name: String,
        role: String,
        instrument: String,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    discriminatorKey: '_variant',
  }
)

const extendedMusicianSchema = musicianSchema.clone()

extendedMusicianSchema.add({
  revision: musicianSchema, // store a copy of fields in revision, when user wants to update them

  // these fields won't be in a revision
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    sparse: true,
  },
  profileStatus: {
    type: String,
    enum: profileStatuses,
    required: true,
  },
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
})

extendedMusicianSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    // update user roles
    await User.findByIdAndUpdate(doc.user, {
      $pull: { roles: 'Musician' },
    })

    // delete musician's events
    await Event.deleteMany({ _id: { $in: doc.events } })

    // delete musician's files from the cloud
    if (doc.logo && doc.logo.filepath) {
      await cloudinary.uploader.destroy(doc.logo.filepath)
      debug.log('❌Deleted file: ', doc.logo.filepath)
    }

    const deleteGallery = doc.gallery.map(async (image) => {
      if (image.filepath) {
        await cloudinary.uploader.destroy(image.filepath)
        debug.log('❌Deleted file: ', image.filepath)
      }
    })

    const deleteSongs = doc.songs.map(async (song) => {
      if (song.filepath) {
        await cloudinary.uploader.destroy(song.filepath)
        debug.log('❌Deleted file: ', song.filepath)
      }
    })

    await Promise.all(deleteGallery)
    await Promise.all(deleteSongs)

    // delete files in revision
    if (doc.revision) {
      const { logo, gallery, songs } = doc.revision

      if (logo && logo.filepath) {
        await cloudinary.uploader.destroy(logo.filepath)
        debug.log('❌Deleted file: ', logo.filepath)
      }

      const deleteRevisionGallery = gallery.map(async (image) => {
        if (image.filepath) {
          await cloudinary.uploader.destroy(image.filepath)
          debug.log('❌Deleted file: ', image.filepath)
        }
      })

      const deleteRevisionSongs = songs.map(async (song) => {
        if (song.filepath) {
          await cloudinary.uploader.destroy(song.filepath)
          debug.log('❌Deleted file: ', song.filepath)
        }
      })

      await Promise.all(deleteRevisionGallery)
      await Promise.all(deleteRevisionSongs)
    }
  }
})

const Musician = mongoose.model('Musician', extendedMusicianSchema)
const StrayMusician = Musician.discriminator(
  'StrayMusician',
  extendedMusicianSchema
)

const removePaths = [
  'genre',
  'bio',
  'website',
  'phone',
  'influences',
  'address',
  'band',
  'logo',
  'gallery',
  'songs',
  'members',
  'revision',
  'user',
  'profileStatus',
]

// remove all fields except name
StrayMusician.schema.remove(removePaths)

Musician.schema.virtual('fullAddress').get(function () {
  const { address, state, city } = this.address
  let fullAddress = ''

  fullAddress += address && `${address}, `
  fullAddress += city && `${city}, `
  fullAddress += state && state

  return fullAddress
})

module.exports = {
  Musician,
  StrayMusician,
}
