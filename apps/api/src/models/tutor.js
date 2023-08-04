const mongoose = require('mongoose')
const addressSchema = require('./schemas/address')
const { tutorAvailabilityTypes } = require('../seeds/seedHelpers')

const { Schema } = mongoose

const tutorSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    name: { type: String, required: true },
    subject: { type: String, enum: ['music', 'art'], required: true },
    availability: {
      type: String,
      enum: tutorAvailabilityTypes,
      required: true,
    },
    instrument: { type: String, required: true },
    contact: { type: String, required: true },
    address: {
      type: addressSchema,
      required: true,
    },
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
  }
)

module.exports = mongoose.model('Tutor', tutorSchema)
