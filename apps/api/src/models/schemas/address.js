const { Schema } = require('mongoose')

const addressSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
})

module.exports = addressSchema
