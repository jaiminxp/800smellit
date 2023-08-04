const mongoose = require('mongoose')
const addressSchema = require('./schemas/address')
const cloudAssetSchema = require('./schemas/cloud-asset')

const { Schema } = mongoose

const baseVenueSchema = new Schema(
  {
    name: { type: String, required: true },
    address: {
      type: addressSchema,
      required: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
  },
  {
    virtuals: {
      fullAddress: {
        get() {
          const { address, state, city } = this.address
          let fullAddress = ''

          fullAddress += address && `${address}, `
          fullAddress += city && `${city}, `
          fullAddress += state && state

          return fullAddress
        },
      },
    },
    toJSON: { virtuals: true },
    discriminatorKey: '_variant',
  }
)

const venueSchema = baseVenueSchema.clone().add({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: true },
  theme: { type: String, required: true },
  details: { type: String, required: true },
  gallery: [cloudAssetSchema],
  contact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
})

const Venue = mongoose.model('Venue', venueSchema)
const StrayVenue = Venue.discriminator('StrayVenue', venueSchema)

const removePaths = [
  'user',
  'phone',
  'email',
  'website',
  'theme',
  'details',
  'gallery',
  'contact.name',
  'contact.phone',
  'contact.email',
]

// remove all paths except baseVenueSchema paths
StrayVenue.schema.remove(removePaths)

module.exports = {
  StrayVenue,
  Venue,
}
