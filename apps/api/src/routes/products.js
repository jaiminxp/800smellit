const express = require('express')
const catchAsync = require('../lib/catchAsync')
const productController = require('../controllers/products')
const { validateQuery, validateBody } = require('../lib/middleware')
const { productSchemas } = require('../lib/schemas')

const router = express.Router()

router
  .route('/')
  .get(
    validateQuery(productSchemas.search),
    catchAsync(productController.search)
  )
  .post(
    validateBody(productSchemas.create),
    catchAsync(productController.create)
  )

module.exports = router
