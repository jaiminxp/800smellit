const express = require('express')
const passport = require('passport')
const catchAsync = require('../lib/catchAsync')
const eventController = require('../controllers/events')
const { eventSchemas } = require('../lib/schemas')
const { validateQuery, validateBody } = require('../lib/middleware')

const router = express.Router()

router
  .route('/')
  .get(validateQuery(eventSchemas.search), catchAsync(eventController.search))
  .post(
    validateBody(eventSchemas.create),
    passport.authenticate('jwt', { session: false }),
    catchAsync(eventController.createEvent)
  )

router
  .route('/:id')
  .put(
    passport.authenticate('jwt', { session: false }),
    validateBody(eventSchemas.update),
    catchAsync(eventController.update)
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    catchAsync(eventController.deleteEvent)
  )

module.exports = router
