const router = require('express').Router()
const {
  getEvent,
  getLastEvents,
  getTimelineDTOs,
} = require('../controllers/events.controller')

router.get('/:eventId', getEvent)
router.get('/last', getLastEvents)
router.get('/timelinedtos/:categoryName', getTimelineDTOs)

module.exports = router
