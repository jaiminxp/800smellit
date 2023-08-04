const mongoose = require('mongoose')

const { Schema } = mongoose

const eventSchema = new Schema({
  organizerInfo: {
    organizer: {
      type: Schema.Types.ObjectId,
      refPath: 'organizerType',
      required: true,
    },
    name: String,
  },
  organizerType: {
    type: String,
    enum: ['Musician', 'Artist'],
    required: true,
  },
  venue: {
    type: Schema.Types.ObjectId,
    ref: 'Venue',
  },
  name: String,
  genre: String,
  date: Date,
})

module.exports = mongoose.model('Event', eventSchema)
