const mongoose = require('mongoose')
const { userProfileTypes } = require('../seeds/seedHelpers')

const { Schema } = mongoose

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: [true, 'Account with this email already exists'],
  },

  hash: {
    type: String,
    required: true,
  },

  salt: {
    type: String,
    required: true,
  },

  isEmailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },

  emailVerificationToken: {
    type: String,
    unique: true,
  },

  roles: {
    type: [{ type: String, enum: [...userProfileTypes, 'admin'] }],
  },
})

module.exports = mongoose.model('User', UserSchema)
