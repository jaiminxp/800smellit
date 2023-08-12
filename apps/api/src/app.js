require('dotenv').config()

const express = require('express')

const app = express()
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const path = require('path')
const methodOverride = require('method-override')
const helmet = require('helmet')
const debug = require('./lib/debug')
const { logError, errorHandler } = require('./lib/middleware')

const eventRoutes = require('./routes/events')
const musicianRoutes = require('./routes/musicians')
const artistRoutes = require('./routes/artists')
const userRoutes = require('./routes/users')
const adminRoutes = require('./routes/admin')
const productRoutes = require('./routes/products')
const tutorRoutes = require('./routes/tutors')
const serviceRoutes = require('./routes/services')
const venueRoutes = require('./routes/venues')
const utilsRoutes = require('./routes/utils')
const ExpressError = require('./lib/ExpressError')

const port = process.env.PORT || 3333

// CONFIGURES THE DATABASE
require('./config/database')

// CONFIGURES PASSPORT
require('./config/passport')(passport)

app.use(passport.initialize())

// VIEW ENGINE SETUP
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// MIDDLEWARES
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'assets')))
app.use(morgan('dev', { stream: { write: (msg) => debug.log(msg.trimEnd()) } }))
app.use(helmet())
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3002',
      'https://800smellit.vercel.app',
      'https://800smellit-admin.vercel.app',
    ],
    credentials: true,
  })
)

// ROUTES
app.use('/', userRoutes)
app.use('/admin', adminRoutes)
app.use('/events', eventRoutes)
app.use('/musicians', musicianRoutes)
app.use('/artists', artistRoutes)
app.use('/products', productRoutes)
app.use('/tutors', tutorRoutes)
app.use('/services', serviceRoutes)
app.use('/venues', venueRoutes)
app.use('/', utilsRoutes)

// handle 404 error
app.all('*', (req) => {
  throw new ExpressError(`Route ${req.path} not found`, 404)
})

app.use(logError)
app.use(errorHandler)

app.listen(port, () => {
  debug.status(`Serving at port ${port}`)
})
