const mongoose = require('mongoose')
const addressSchema = require('./schemas/address')

const { Schema } = mongoose

const serviceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    name: { type: String, required: true },
    expert: { type: String, required: true },
    domain: { type: String, enum: ['music', 'art'], required: true },
    contact: { type: String, required: true },
    website: { type: String },
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

module.exports = mongoose.model('Service', serviceSchema)
