const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', () => {
  console.log('✅ Database connected')
})
