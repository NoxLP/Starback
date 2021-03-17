const router = require('express').Router()
const { authUser } = require('../utils/index')
const { putAddFavourite } = require('../controllers/users.controller')

router.put('/events/favourites/:eventId', authUser, putAddFavourite)

module.exports = router
