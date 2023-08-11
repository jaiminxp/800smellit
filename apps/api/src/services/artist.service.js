const { cloudinary } = require('../config/cloudinary')
const debug = require('../lib/debug')
const { Artist } = require('../models/artist')

class ArtistService {
  static async approveUpdate(artist) {
    const { gallery: ogGallery } = artist
    const { gallery, ...rest } = artist.revision

    const updatePayload = {}

    if (gallery.length !== 0) {
      updatePayload.gallery = gallery

      // delete existing gallery
      const deleteGallery = ogGallery.map(async (image) => {
        if (image.filepath) {
          await cloudinary.uploader.destroy(image.filepath)
          debug.log('❌Deleted file: ', image.filepath)
        }
      })

      await Promise.all(deleteGallery)
    }

    // prepare update payload
    Object.entries(rest).forEach(([key, value]) => {
      if (key !== '_id' && key !== 'id') {
        updatePayload[key] = value
      }
    })

    await Artist.findByIdAndUpdate(artist._id, {
      $set: updatePayload,
      $unset: { revision: 1 },
    })
  }

  static async rejectUpdate(artist) {
    const { gallery } = artist.revision

    // delete assets uploaded during revision
    const deleteGallery = gallery.map(async (image) => {
      if (image.filepath) {
        await cloudinary.uploader.destroy(image.filepath)
        debug.log('❌Deleted file: ', image.filepath)
      }
    })

    await Promise.all(deleteGallery)

    await Artist.findByIdAndUpdate(artist._id, {
      $unset: { revision: 1 },
    })
  }
}

module.exports = ArtistService
