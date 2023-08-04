const { getUser } = require('../lib/utils')
const Tutor = require('../models/tutor')

const search = async (req, res) => {
  const { state, city, availability, subject, instrument } = req.query

  const tutors = await Tutor.find({
    instrument: instrument
      ? { $regex: new RegExp(instrument, 'i') }
      : { $ne: null },
    availability: availability || { $ne: null },
    subject: subject || { $ne: null },
    'address.city': city ? { $regex: new RegExp(city, 'i') } : { $ne: null },
    'address.state': state || { $ne: null },
  })

  res.send(tutors)
}

const create = async (req, res) => {
  const user = await getUser(req)

  const { address, state, city, ...tutorData } = req.body

  const tutor = new Tutor({
    ...tutorData,
    user,
    address: {
      address,
      state,
      city,
    },
  })

  await tutor.save()
  res.send('Tutor registered.')
}

module.exports = {
  search,
  create,
}
