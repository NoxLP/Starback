const router = require('express').Router()
const { authUser } = require('../utils/index')
const { putAddFavourite, getUser } = require('../controllers/users.controller')

router.get('/me', authUser, getUser)
router.put('/events/favourites/:eventId', authUser, putAddFavourite)

module.exports = router
