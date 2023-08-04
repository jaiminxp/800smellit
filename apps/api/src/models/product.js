const mongoose = require('mongoose')
const addressSchema = require('./schemas/address')

const { Schema } = mongoose

const productSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['music', 'art'], required: true },
    category: {
      type: String,
      enum: ['instrument', 'component'],
      required: true,
    },
    instrument: { type: String, required: true },
    component: {
      type: String,
      validate: {
        validator(component) {
          return this.category === 'component' || !component
        },
        message: 'Product of instrument category cannot contain a component.',
      },
    },
    contact: { type: String, required: true },
    seller: { type: String, required: true },
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

module.exports = mongoose.model('Product', productSchema)
