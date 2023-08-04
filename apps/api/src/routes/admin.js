const express = require('express')
const passport = require('passport')
const catchAsync = require('../lib/catchAsync')
const adminController = require('../controllers/admin')
const { isAdmin, validateQuery, validateBody } = require('../lib/middleware')
const { adminSchemas } = require('../lib/schemas')

const router = express.Router()

// authenticate & authorize all admin routes
router.all(
  '/*',
  passport.authenticate('jwt', { session: false }),
  catchAsync(isAdmin)
)

router.get('/', catchAsync(adminController.getDashboardStats))

router.get(
  '/users',
  validateQuery(adminSchemas.getUsers),
  catchAsync(adminController.getUsers)
)

router.get('/users/:id', catchAsync(adminController.getUserById))

router.get(
  '/pending/statistics',
  catchAsync(adminController.getPendingStatistics)
)

router.get(
  '/pending/musicians',
  catchAsync(adminController.getPendingMusicians)
)

router.get('/pending/artists', catchAsync(adminController.getPendingArtists))

router.put(
  '/musician/:id/update-status',
  validateBody(adminSchemas.updateStatus),
  catchAsync(adminController.updateMusicianStatus)
)

router.put(
  '/artist/:id/update-status',
  validateBody(adminSchemas.updateStatus),
  catchAsync(adminController.updateArtistStatus)
)

router.get('/musician/:id', catchAsync(adminController.getMusicianById))

router.get('/artist/:id', catchAsync(adminController.getArtistById))

router.get('/musicians', catchAsync(adminController.searchMusicians))

router.get('/artists', catchAsync(adminController.searchArtists))

module.exports = router
