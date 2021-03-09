const router = require('express').Router()
const { getEvent,
        pushEvent,
        getLastEvent 
    } = require('../controllers/event.controller')

router.get('/events/:eventId', getEvent)
router.put('/events/favourite/:eventId', pushEvent)
router.get('/events/last', getLastEvent)
router.get('/events/timelinedtos/:categoryName', getCategory)

module.exports = router
