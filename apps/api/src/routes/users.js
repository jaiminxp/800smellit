const express = require('express')
const passport = require('passport')
const catchAsync = require('../lib/catchAsync')
const userController = require('../controllers/users')

const router = express.Router()

router.post('/signup', catchAsync(userController.signup))

router.post('/login', catchAsync(userController.login))

router.get('/verify-email/:token', catchAsync(userController.verifyEmail))

router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  catchAsync(userController.getCurrentUser)
)

module.exports = router
