const express = require('express')
const passport = require('passport')
const upload = require('multer')()
const catchAsync = require('../lib/catchAsync')
const musicianController = require('../controllers/musicians')
const { musicianSchemas } = require('../lib/schemas')
const { validateQuery } = require('../lib/middleware')

const router = express.Router()

router
  .route('/')
  .get(
    validateQuery(musicianSchemas.search),
    catchAsync(musicianController.search)
  )
  .post(
    passport.authenticate('jwt', { session: false }),
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'gallery', maxCount: 5 },
      { name: 'songs', maxCount: 3 },
    ]),
    catchAsync(musicianController.createMusician)
  )

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  catchAsync(musicianController.me)
)

router.get(
  '/autocomplete',
  passport.authenticate('jwt', { session: false }),
  catchAsync(musicianController.autocomplete)
)

router.post('/strays', catchAsync(musicianController.createStray))

router.get(
  '/strays/autocomplete',
  catchAsync(musicianController.strayAutocomplete)
)

router.get('/:id/change-status', catchAsync(musicianController.updateStatus))

router
  .route('/:id')
  .get(musicianController.getMusician)
  .put(
    passport.authenticate('jwt', { session: false }),
    upload.fields([
      { name: 'logo', maxCount: 1 },
      { name: 'gallery', maxCount: 5 },
      { name: 'songs', maxCount: 3 },
    ]),
    catchAsync(musicianController.updateMusician)
  )

module.exports = router
