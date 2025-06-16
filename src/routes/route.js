const express = require('express')
const router = express.Router()

const { login, register } = require('../controllers/auth.controller')
const { getAllUser } = require('../controllers/user.controller')

router.post('/register/', register)
router.post('/login/', login)

router.get('/users', getAllUser)

module.exports = router