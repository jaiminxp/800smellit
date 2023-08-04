const express = require('express')
const utilsController = require('../controllers/utils')

const router = express.Router()

router.post('/feedback', utilsController.sendFeedBack)

module.exports = router
