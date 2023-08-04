const express = require('express')
const catchAsync = require('../lib/catchAsync')
const serviceController = require('../controllers/services')
const { validateQuery, validateBody } = require('../lib/middleware')
const { serviceSchemas } = require('../lib/schemas')

const router = express.Router()

router
  .route('/')
  .get(
    validateQuery(serviceSchemas.search),
    catchAsync(serviceController.search)
  )
  .post(
    validateBody(serviceSchemas.create),
    catchAsync(serviceController.create)
  )

module.exports = router
