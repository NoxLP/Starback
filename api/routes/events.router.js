const router = require('express').Router()
const { authUser } = require('../utils')
const { getEvent,
        pushEvent,
        getLastEvent 
    } = require('../controllers/events.controller')

router.get('/:eventId', getEvent)
router.put('/favourite/:eventId', pushEvent)
router.get('/last', getLastEvent)
router.get('/timelinedtos/:categoryName', getCategory)

module.exports = router
