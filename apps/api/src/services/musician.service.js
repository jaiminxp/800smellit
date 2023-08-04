const { cloudinary } = require('../config/cloudinary')
const { Musician } = require('../models/musician')

class MusicianService {
  static async approveUpdate(musician) {
    const { songs: ogSongs, gallery: ogGallery, logo: ogLogo } = musician
    const { songs, gallery, logo, ...rest } = musician.revision

    const updatePayload = {}

    if (logo) {
      updatePayload.logo = logo

      // delete existing logo
      if (ogLogo.filepath) {
        await cloudinary.uploader.destroy(ogLogo.filepath)
        console.log('❌Deleted file: ', ogLogo.filepath)
      }
    }

    if (gallery.length !== 0) {
      updatePayload.gallery = gallery

      // delete existing gallery
      const deleteGallery = ogGallery.map(async (image) => {
        if (image.filepath) {
          await cloudinary.uploader.destroy(image.filepath)
          console.log('❌Deleted file: ', image.filepath)
        }
      })

      await Promise.all(deleteGallery)
    }

    if (songs.length !== 0) {
      updatePayload.songs = songs

      // delete existing songs
      const deleteSongs = ogSongs.map(async (song) => {
        if (song.filepath) {
          await cloudinary.uploader.destroy(song.filepath)
          console.log('❌Deleted file: ', song.filepath)
        }
      })

      await Promise.all(deleteSongs)
    }

    // prepare update payload
    Object.entries(rest).forEach(([key, value]) => {
      if (key !== '_id' && key !== 'id') {
        updatePayload[key] = value
      }
    })

    await Musician.findByIdAndUpdate(musician._id, {
      $set: updatePayload,
      $unset: { revision: 1 },
    })
  }

  static async rejectUpdate(musician) {
    const { songs, gallery, logo } = musician.revision

    // delete assets uploaded during revision
    if (logo && logo.filepath) {
      await cloudinary.uploader.destroy(logo.filepath)
      console.log('❌Deleted file: ', logo.filepath)
    }

    const deleteGallery = gallery.map(async (image) => {
      if (image.filepath) {
        await cloudinary.uploader.destroy(image.filepath)
        console.log('❌Deleted file: ', image.filepath)
      }
    })

    const deleteSongs = songs.map(async (song) => {
      if (song.filepath) {
        await cloudinary.uploader.destroy(song.filepath)
        console.log('❌Deleted file: ', song.filepath)
      }
    })

    await Promise.all(deleteGallery)
    await Promise.all(deleteSongs)

    await Musician.findByIdAndUpdate(musician._id, {
      $unset: { revision: 1 },
    })
  }
}

module.exports = MusicianService
