const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const usersController = require('../controllers/UsersController')

router.post('/signup', usersController.signup)

router.post('/signin', usersController.signin)

router.get('/logout', usersController.logout)

router.get('/infor', auth, usersController.infor)

router.put('/infor', auth, usersController.updateInfor)

router.get('/infor/statisticsNumberExam', auth, usersController.statisticsNumberExam)

router.get('/infor/statisticsScoreExam', auth, usersController.statisticsScoreExam)

module.exports = router
