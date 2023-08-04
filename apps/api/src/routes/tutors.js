const express = require('express')
const catchAsync = require('../lib/catchAsync')
const tutorController = require('../controllers/tutors')
const { validateQuery, validateBody } = require('../lib/middleware')
const { tutorSchemas } = require('../lib/schemas')

const router = express.Router()

router
  .route('/')
  .get(validateQuery(tutorSchemas.search), catchAsync(tutorController.search))
  .post(validateBody(tutorSchemas.create), catchAsync(tutorController.create))

module.exports = router
