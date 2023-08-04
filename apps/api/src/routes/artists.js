const express = require('express')
const passport = require('passport')
const upload = require('multer')()
const catchAsync = require('../lib/catchAsync')
const artistController = require('../controllers/artists')

const router = express.Router()

router
  .route('/')
  .get(catchAsync(artistController.getArtists))
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.fields([{ name: 'gallery', maxCount: 5 }]),
    catchAsync(artistController.createArtist)
  )

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  catchAsync(artistController.me)
)

router.post('/strays', catchAsync(artistController.createStray))

router.get(
  '/strays/autocomplete',
  catchAsync(artistController.strayAutocomplete)
)

router.get(
  '/autocomplete',
  passport.authenticate('jwt', { session: false }),
  catchAsync(artistController.autocomplete)
)

router.get('/:id/change-status', catchAsync(artistController.updateStatus))

router
  .route('/:id')
  .get(catchAsync(artistController.getArtist))
  .put(
    passport.authenticate('jwt', { session: false }),
    upload.fields([{ name: 'gallery', maxCount: 5 }]),
    catchAsync(artistController.updateArtist)
  )

module.exports = router
