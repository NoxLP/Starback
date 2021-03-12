const eventsModel = require('../models/events.model')

//#region apis
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
  timeout: 10000,
})
//#endregion

//#region helpers
const buildTimelineDTO = (event) => {
  return {
    date: event.date,
    title: event.title,
  }
}
const filterNearestDayWeatherData = (weather, date) => {
  const dateTimestamp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  ).getTime()

  const exactDayIndex = weather.daily.findIndex((x) => x.dt === dateTimestamp)
  if (exactDayIndex !== -1) {
    return weather.daily[exactDayIndex].weather.description
  } else {
    const nextDayTimestamp = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    ).getTime()

    for (let day of weather.daily) {
      if (day.dt >= dateTimestamp && day.dt <= nextDayTimestamp)
        return day.weather.description
    }

    return null
  }
}
const getWeatherData = async (coords, date) => {
  //weather api only covers 7 days after now
  if (date.getDate() > new Date(Date.now()).getDate() + 7) return null
  //********************/

  const lat = coords[0]
  const lon = coords[1]

  try {
    let weather = (
      await weatherApi.get('/', {
        params: {
          lat: lat,
          lon: lon,
          appid: process.env.WEATHER_API_KEY,
        },
      })
    ).data

    return filterNearestDayWeatherData(weather, date)
  } catch (err) {
    console.log('error in weather api: ', err)
    return null
  }
}
const buildImageSearchParams = (event) => {
  switch (event.category) {
    case 'eclipsesMoon':
    case 'eclipsesSun':
      return {
        description__icontains: 'eclipse',
      }
    case 'planets':
      return {
        description__icontains: event.origData.categoryName,
      }
    case 'meteorShowers':
      return {
        description__icontains: 'shower',
      }
    case 'comets':
      return {
        description__icontains: 'comet',
      }
    default:
      return {
        description__icontains: 'conjunction',
      }
  }
}
//#endregion

//#region events endpoints
async function getLastEvents(req, res) {
  const now = new Date(Date.now())

  try {
    const event = await eventsModel
      .find({ date: { $gte: now } })
      .sort({ date: 1 })
      .limit(4)

    res.status(200).json(event)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
async function getTimelineDTOs(req, res) {
  const categoryName = req.params.categoryName
  const limit = parseInt(req.query.limit)
  const page = parseInt(req.query.page)

  try {
    let events = await eventsModel
      .find({ category: categoryName })
      .limit(limit)
      .skip(limit * page)

    events = events.map((event) => buildTimelineDTO(event))

    res.status(200).json(events)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}

function getEvent(req, res) {
  console.log(`Get event request`)
  eventsModel
    .findById(req.params.eventId)
    .then((event) => {
      res.status(200).json(event)
    })
    .catch((err) => {
      console.log('get last event error: ', err)
      res.status(400).json(err)
    })
}
//#endregion

//#region apis endpoints
async function getEventMoonPhase(req, res) {
  console.log('getEventMoonPhase')
  try {
    const event = await eventsModel.findById(req.params.eventId)
    const moon = (
      await moonApi.get('/', {
        params: { d: event.date.getTime() },
      })
    ).data[0].phase

    res.status(200).json(moon)
  } catch (err) {
    err = `Error in moon api: ${err}`
    console.log(err)
    res.status(400).json(err)
  }
}
async function getEventImage(req, res) {
  console.log('getEventImage')
  try {
    const event = await eventsModel.findById(req.params.eventId)
    const searchParams = buildImageSearchParams(event)
    searchParams['api_key'] = process.env.IMAGE_API_KEY
    searchParams['api_secret'] = process.env.IMAGE_API_SECRET
    searchParams['format'] = 'json'
    searchParams['limit'] = 100
    console.log(searchParams)

    const imageData = (
      await imgApi.get('/', {
        params: searchParams,
      })
    ).data

    if (!imageData || imageData.objects.len === 0) return null

    const randomImage =
      imageData.objects[Math.floor(Math.random() * imageData.objects.length)]

    res.status(200).json({
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
    })
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
async function getEventWeather(req, res) {
  console.log('getEventWeather')
  try {
    const event = await eventsModel.findById(req.params.eventId)
    //weather api only covers 7 days after now
    if (event.date.getDate() > new Date(Date.now()).getDate() + 7) {
      res.status(400).json('weather api only covers 7 days after now')
      return
    }
    //********************/

    const lat = req.query.lat
    const lon = req.query.lon

    const weather = (
      await weatherApi.get('/', {
        params: {
          lat: lat,
          lon: lon,
          appid: process.env.WEATHER_API_KEY,
        },
      })
    ).data

    const data = filterNearestDayWeatherData(weather, event.date)
    res.status(200).json(data)
  } catch (err) {
    console.log('error in weather api: ', err)
    res.status(400).json(err)
  }
}
//#endregion

module.exports = {
  getLastEvents,
  getTimelineDTOs,
  getEvent,
  getEventMoonPhase,
  getEventImage,
  getEventWeather,
}
