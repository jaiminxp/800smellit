const { Schema } = require('mongoose')

const cloudAssetSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  filepath: String,
})

module.exports = cloudAssetSchema
