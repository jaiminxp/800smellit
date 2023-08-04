const express = require('express')
const upload = require('multer')()
const passport = require('passport')
const catchAsync = require('../lib/catchAsync')
const venueController = require('../controllers/venues')
const { validateQuery, validateBody } = require('../lib/middleware')
const { venueSchemas } = require('../lib/schemas')

const router = express.Router()

router
  .route('/')
  .get(validateQuery(venueSchemas.search), catchAsync(venueController.search))
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.fields([{ name: 'gallery', maxCount: 5 }]),
    validateBody(venueSchemas.create),
    catchAsync(venueController.create)
  )

router.get(
  '/autocomplete',
  passport.authenticate('jwt', { session: false }),
  catchAsync(venueController.autocomplete)
)

router
  .route('/me')
  .get(
    passport.authenticate('jwt', { session: false }),
    catchAsync(venueController.me)
  )

router
  .route('/strays')
  .post(
    passport.authenticate('jwt', { session: false }),
    validateBody(venueSchemas.createStray),
    catchAsync(venueController.createStray)
  )

router
  .route('/strays/autocomplete')
  .get(
    passport.authenticate('jwt', { session: false }),
    catchAsync(venueController.strayAutocomplete)
  )

router
  .route('/:id')
  .get(catchAsync(venueController.findById))
  .put(
    passport.authenticate('jwt', { session: false }),
    upload.fields([{ name: 'gallery', maxCount: 5 }]),
    validateBody(venueSchemas.create),
    catchAsync(venueController.update)
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    catchAsync(venueController.del)
  )

module.exports = router
