const { getUser } = require('../lib/utils')
const Service = require('../models/service')

const search = async (req, res) => {
  const { state, city, name, domain, expert } = req.query

  const tutors = await Service.find({
    name: name ? { $regex: new RegExp(name, 'i') } : { $ne: null },
    expert: expert ? { $regex: new RegExp(expert, 'i') } : { $ne: null },
    domain: domain || { $ne: null },
    'address.city': city ? { $regex: new RegExp(city, 'i') } : { $ne: null },
    'address.state': state || { $ne: null },
  })

  res.json(tutors)
}

const create = async (req, res) => {
  const user = await getUser(req)

  const { address, state, city, ...serviceData } = req.body

  const tutor = new Service({
    ...serviceData,
    user,
    address: {
      address,
      state,
      city,
    },
  })

  await tutor.save()
  res.send('Service created.')
}

module.exports = {
  search,
  create,
}
