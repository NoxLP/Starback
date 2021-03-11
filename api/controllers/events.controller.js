const eventsModel = require('../models/events.model')

const axios = require('axios').default
const moonApi = axios.create({
  baseURL: 'https://api.farmsense.net/v1/moonphases/',
  timeout: 3000,
})
const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/onecall',
  timeout: 3000,
})
const imgApi = axios.create({
  baseURL: 'http://astrobin.com/api/v1/image',
  timeout: 3000,
})

//#region helpers
const buildTimelineDTO = (event) => {
  return {
    date: event.date,
    title: event.title,
  }
}
const getMoonData = async (event) => {
  try {
    return (
      await moonApi.get('/', {
        params: { d: event.date.getTime() },
      })
    ).data[0].phase
  } catch (err) {
    console.log('error in moon api: ', err)
    return null
  }
}
const getWeatherData = async (lat, lon, date) => {
  try {
    let weather = (
      await weatherApi.get('https://api.openweathermap.org/data/2.5/onecall', {
        params: {
          lat: lat,
          lon: lon,
          appid: process.env.WEATHER_API_KEY,
        },
      })
    ).data

    //const minDate =
  } catch (err) {
    console.log('error in weather api: ', err)
    return null
  }
}
const getDataFromAPIs = async (event, lat, lon) => {
  try {
    const imageData = (
      await imgApi.get('http://astrobin.com/api/v1/image/', {
        params: {
          api_key: process.env.IMAGE_API_KEY,
          api_secret: process.env.IMAGE_API_SECRET,
          format: 'json',
        },
      })
    ).data

    if (!imageData || imageData.objects.len === 0) return null

    const randomImage =
      imageData.objects[Math.floor(Math.random() * imageData.objects.length)]

    return {
      urls: {
        url_duckduckgo: randomImage.url_duckduckgo,
        url_duckduckgo_small: randomImage.url_duckduckgo_small,
        url_gallery: randomImage.url_gallery,
        url_hd: randomImage.url_hd,
        url_histogram: randomImage.url_histogram,
        url_real: randomImage.url_real,
        url_regular: randomImage.url_regular,
        url_skyplot: randomImage.url_skyplot,
        url_thumb: randomImage.url_thumb,
      },
      astroBinUser: randomImage.user,
      hash: randomImage.hash,
    }
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
//#endregion

async function getLastEvents(req, res) {
  const first = new Date(Date.now())
  const last = new Date(first.setMonth(first.getMonth() + 1))

  try {
    const event = await eventsModel
      .find({ date: { $gte: first, $lt: last } })
      .sort({ date: 1 })

    res.status(200).json(event)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
async function getTimelineDTOs(req, res) {
  const categoryName = req.params.categoryName
  const limit = req.query.limit

  try {
    let events = await eventsModel.find({ category: categoryName }).limit(limit)

    events.map((event) => buildTimelineDTO(event))

    res.status(200).json(events)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
async function getEvent(req, res) {
  const eventId = req.params.eventId
}

/*
getEvent,
  pushEvent,
  getLastEvent,
  getTimelineDTOs,
*/
module.exports = {
  getLastEvents,
  getTimelineDTOs,
  getEvent,
}
