const router = require('express').Router()
const { signUp, login } = require('../controllers/auth.controller')

router.post('/users/signup', signUp)
router.post('/users/login', login)

module.exports = router
