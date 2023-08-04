const { getUser } = require('../lib/utils')
const Product = require('../models/product')

const search = async (req, res) => {
  const { state, city, type, category } = req.query

  const products = await Product.find({
    type: type || { $ne: null },
    category: category || { $ne: null },
    'address.city': city ? { $regex: new RegExp(city, 'i') } : { $ne: null },
    'address.state': state || { $ne: null },
  })

  res.json(products)
}

const create = async (req, res) => {
  const user = await getUser(req)

  const {
    seller,
    contact,
    address,
    state,
    city,
    type,
    category,
    instrument,
    component,
  } = req.body

  const product = new Product({
    user,
    seller,
    contact,
    address: {
      address,
      state,
      city,
    },
    type,
    category,
    instrument,
  })

  if (category === 'component') {
    product.component = component
  }

  await product.save()
  res.send('Product created.')
}

module.exports = {
  search,
  create,
}
