const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const categoriesController = require('../controllers/CategoriesController')

router.get('/show', categoriesController.show)

router.post('/create', auth, authAdmin, categoriesController.create)

router.delete('/delete/:id', auth, authAdmin, categoriesController.delete)

router.put('/update/:id', auth, authAdmin, categoriesController.update)

module.exports = router
