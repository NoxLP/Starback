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
  timeout: 3000,
})
//#endregion

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
      await weatherApi.get('https://api.openweathermap.org/data/2.5/onecall', {
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
const getImageData = async (event) => {
  try {
    const searchParams = buildImageSearchParams(event)
    searchParams[api_key] = process.env.IMAGE_API_KEY
    searchParams[api_secret] = process.env.IMAGE_API_SECRET
    searchParams[format] = 'json'
    searchParams[limit] = 100

    const imageData = (
      await imgApi.get('http://astrobin.com/api/v1/image/', {
        params: searchParams,
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
    return null
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
  const coords = req.query.lat ? [req.query.lat, req.query.lon] : null
  console.log(`Get event request with: 
id: ${eventId}
coords: ${coords}
`)

  try {
    const event = await eventsModel.findById(eventId)

    if (!event) {
      const err = 'Event not found'
      console.log(err)
      res.status(404).send(err)
      return
    }

    const dataPromises = [
      getMoonData(event),
      coords ? getWeatherData(coords, event.date) : null,
      getImageData(event),
    ].map((x) => x.catch((err) => null))

    const data = await Promise.all(dataPromises)
    return {
      ...event,
      moon: data[0],
      weather: data[1],
      img: data[2],
    }
  } catch (err) {
    console.log('get last event error: ', err)
    res.status(400).json(err)
  }
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
