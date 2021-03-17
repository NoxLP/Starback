const router = require('express').Router()
const { authUser } = require('../utils/index')
const { putAddFavourite } = require('../controllers/events.controller')

router.put('/users/events/favourites/:eventId', authUser, putAddFavourite)

module.exports = router
