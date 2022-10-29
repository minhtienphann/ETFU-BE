const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const examsController = require('../controllers/ExamsController')

router.get('/show',  examsController.show)

router.post('/show/submit', examsController.submit)

module.exports = router
