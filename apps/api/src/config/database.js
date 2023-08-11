const mongoose = require('mongoose')
const debug = require('../lib/debug')

mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection
db.on('error', (err) => debug.error('Database connection error:', err))
db.on('open', () => {
  debug.status('Database connected')
})
