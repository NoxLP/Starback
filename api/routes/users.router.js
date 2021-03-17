const router = require('express').Router()
const { putAddFavourite } = require('../controllers/users.controller')

router.put('/events/favourites/:eventId', putAddFavourite)

module.exports = router
