const router = require('express').Router()
const { putAddFavourite, getUser } = require('../controllers/users.controller')

router.get('/me', getUser)
router.put('/events/favourites/:eventId', putAddFavourite)

module.exports = router
