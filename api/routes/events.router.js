const router = require('express').Router()
const { authUser } = require('../utils/index')
const {
  getEvent,
  getLastEvents,
  getTimelineDTOs,
  getEventMoonPhase,
  getEventImage,
  getEventWeather,
} = require('../controllers/events.controller')

router
  .get('/last', authUser, getLastEvents)
  .get('/timelinedtos/:categoryName', authUser, getTimelineDTOs)
  .get('/:eventId/moon', authUser, getEventMoonPhase)
  .get('/:eventId/image', authUser, getEventImage)
  .get('/:eventId/weather', authUser, getEventWeather)
  .get('/:eventId', authUser, getEvent)

module.exports = router
