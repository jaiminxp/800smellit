const mongoose = require('mongoose')
const addressSchema = require('./schemas/address')
const cloudAssetSchema = require('./schemas/cloud-asset')
const Event = require('./event')
const User = require('./user')
const { profileStatuses } = require('../seeds/seedHelpers')
const { cloudinary } = require('../config/cloudinary')

const { Schema } = mongoose

// user can update these fields
const artistSchema = new Schema(
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

    gallery: [cloudAssetSchema],
  },
  {
    toJSON: { virtuals: true },
    discriminatorKey: '_variant',
  }
)

const extendedArtistSchema = artistSchema.clone()

extendedArtistSchema.add({
  revision: artistSchema, // store a copy of fields in revision, when user wants to update them

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

extendedArtistSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    // update user roles
    await User.findByIdAndUpdate(doc.user, {
      $pull: { roles: 'Artist' },
    })

    // delete artist's events
    await Event.deleteMany({ _id: { $in: doc.events } })

    // delete artist's files from the cloud
    const deleteGallery = doc.gallery.map(async (image) => {
      if (image.filepath) {
        await cloudinary.uploader.destroy(image.filepath)
        console.log('❌Deleted file: ', image.filepath)
      }
    })

    await Promise.all(deleteGallery)

    // delete files in revision
    if (doc.revision) {
      const { gallery } = doc.revision

      const deleteRevisionGallery = gallery.map(async (image) => {
        if (image.filepath) {
          await cloudinary.uploader.destroy(image.filepath)
          console.log('❌Deleted file: ', image.filepath)
        }
      })

      await Promise.all(deleteRevisionGallery)
    }
  }
})

const Artist = mongoose.model('Artist', extendedArtistSchema)
const StrayArtist = Artist.discriminator('StrayArtist', extendedArtistSchema)

const removePaths = [
  'genre',
  'bio',
  'website',
  'phone',
  'influences',
  'address',
  'gallery',
  'revision',
  'user',
  'profileStatus',
]

// remove all fields except name
StrayArtist.schema.remove(removePaths)

Artist.schema.virtual('fullAddress').get(function () {
  const { address, state, city } = this.address
  let fullAddress = ''

  fullAddress += address && `${address}, `
  fullAddress += city && `${city}, `
  fullAddress += state && state

  return fullAddress
})

module.exports = { Artist, StrayArtist }
