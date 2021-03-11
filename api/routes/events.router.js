const router = require('express').Router()
const {
  getEvent,
  getLastEvents,
  getTimelineDTOs,
} = require('../controllers/event.controller')

router.get('/:eventId', getEvent)
router.get('/last', getLastEvents)
router.get('/timelinedtos/:categoryName', getTimelineDTOs)

module.exports = router
