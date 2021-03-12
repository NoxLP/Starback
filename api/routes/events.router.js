const router = require('express').Router()
const {
  getEvent,
  getLastEvents,
  getTimelineDTOs,
  getEventMoonPhase,
  getEventImage,
  getEventWeather,
} = require('../controllers/events.controller')

router
  .get('/last', getLastEvents)
  .get('/timelinedtos/:categoryName', getTimelineDTOs)
  .get('/:eventId/moon', getEventMoonPhase)
  .get('/:eventId/image', getEventImage)
  .get('/:eventId/weather', getEventWeather)
  .get('/:eventId', getEvent)

module.exports = router
