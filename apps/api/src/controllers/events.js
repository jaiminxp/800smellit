const Event = require('../models/event')
const { Musician } = require('../models/musician')
const { Artist } = require('../models/artist')
const { Venue } = require('../models/venue')

const createEvent = async (req, res) => {
  const {
    organizerType,
    organizerId,
    date,
    time,
    venue: venueId,
    ...eventData
  } = req.body

  let organizer
  if (organizerType === 'Musician') {
    organizer = await Musician.findById(organizerId)
  } else if (organizerType === 'Artist') {
    organizer = await Artist.findById(organizerId)
  }

  const event = new Event({
    ...eventData,
    venue: venueId,
    organizerType,
    date: new Date(`${time} ${date}`),
    organizerInfo: {
      organizer: organizerId,
      name: organizer.name,
    },
  })

  event.populate('venue')

  organizer.events.push(event._id)

  const jobs = [
    event.save(),
    organizer.save(),
    Venue.findByIdAndUpdate(venueId, {
      $push: { events: event._id },
    }),
  ]

  await Promise.all(jobs)

  res.json(event)
}

const search = async (req, res) => {
  const { type, name, state, city, genre, startDate, endDate } = req.query

  const events = await Event.aggregate()
    .match({
      organizerType: type || { $ne: null },
      'organizerInfo.name': name
        ? { $regex: new RegExp(name, 'i') }
        : { $ne: null },
      genre: genre ? { $regex: new RegExp(genre, 'i') } : { $ne: null },
      date: endDate
        ? {
            // use today's date if the start date is not provided
            $gte: new Date(startDate || null),
            $lte: new Date(endDate),
          }
        : {
            $gte: new Date(startDate || null),
          },
    })
    .lookup({
      from: 'venues',
      localField: 'venue',
      foreignField: '_id',
      as: 'venue',
    })
    .lookup({
      from: type === 'Musician' ? 'musicians' : 'artists',
      localField: 'organizerInfo.organizer',
      foreignField: '_id',
      as: 'organizerInfo.organizer',
    })
    .addFields({
      'organizerInfo.organizer': { $first: '$organizerInfo.organizer' },
      venue: { $first: '$venue' },
    })
    .match({
      'venue.address.city': city
        ? { $regex: new RegExp(city, 'i') }
        : { $ne: null },
      'venue.address.state': state || { $ne: null },
    })
    .addFields({
      'venue.fullAddress': {
        $concat: [
          '$venue.address.address',
          ', ',
          '$venue.address.city',
          ', ',
          '$venue.address.state',
        ],
      },
    })

  res.json(events)
}

const update = async (req, res) => {
  const { id } = req.params
  const {
    date,
    time,
    organizerType,
    organizerId,
    venue: venueId,
    ...eventUpdateData
  } = req.body

  const event = await Event.findById(id).lean()
  let newOrganizer

  switch (organizerType) {
    case 'Musician':
      newOrganizer = await Musician.findById(organizerId).select('name')

      // remove event from old musician and push to new
      if (event.organizerInfo.organizer.toString() !== organizerId) {
        await Musician.findByIdAndUpdate(event.organizerInfo.organizer, {
          $pull: { events: id },
        })

        await Musician.findByIdAndUpdate(organizerId, {
          $push: { events: id },
        })
      }
      break
    case 'Artist':
      newOrganizer = await Artist.findById(organizerId).select('name')

      // remove event from old artist and push to new
      if (event.organizerInfo.organizer.toString() !== organizerId) {
        await Artist.findByIdAndUpdate(event.organizerInfo.organizer, {
          $pull: { events: id },
        })

        await Artist.findByIdAndUpdate(organizerId, {
          $push: { events: id },
        })
      }

      break

    default:
      break
  }

  if (event.venue.toString() !== venueId) {
    // remove event from previous venue
    await Venue.findByIdAndUpdate(event.venue, {
      $pull: { events: id },
    })

    // add event to new venue
    await Venue.findByIdAndUpdate(venueId, {
      $push: { events: id },
    })
  }

  const payload = {
    $set: {
      ...eventUpdateData,
      venue: venueId,
      organizerType,
      organizerInfo: {
        organizer: organizerId,
        name: newOrganizer.name,
      },
      date: new Date(`${time} ${date}`),
    },
  }

  const updatedEvent = await Event.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('venue')

  res.json(updatedEvent)
}

const deleteEvent = async (req, res) => {
  const { id } = req.params

  const deletedEvent = await Event.findByIdAndDelete(id)

  const organizerId = deletedEvent.organizerInfo.organizer

  // delete event from organizer's doc
  if (deletedEvent.organizerType === 'Musician') {
    await Musician.findByIdAndUpdate(organizerId, {
      $pull: { events: deletedEvent.id },
    })
  } else if (deletedEvent.organizerType === 'Artist') {
    await Artist.findByIdAndUpdate(organizerId, {
      $pull: { events: deletedEvent.id },
    })
  }

  await Venue.findByIdAndUpdate(deletedEvent.venue, {
    $pull: { events: deletedEvent.id },
  })

  res.json(deletedEvent)
}

module.exports = {
  createEvent,
  search,
  update,
  deleteEvent,
}
