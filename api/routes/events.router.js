const router = require('express').Router()
const {
  getEvent,
  getLastEvents,
  getTimelineDTOs,
} = require('../controllers/events.controller')

router.get('/last', getLastEvents)
router.get('/timelinedtos/:categoryName', getTimelineDTOs)
router.get('/:eventId', getEvent)

module.exports = router
