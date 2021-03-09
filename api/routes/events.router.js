const router = require('express').Router()
const {
  getEvent,
  pushEvent,
  getLastEvent,
  getCategory,
} = require('../controllers/event.controller')

router.get('/:eventId', getEvent)
router.put('/favourite/:eventId', pushEvent)
router.get('/last', getLastEvent)
router.get('/timelinedtos/:categoryName', getCategory)

module.exports = router
