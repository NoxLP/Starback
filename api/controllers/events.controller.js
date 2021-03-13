const eventsModel = require('../models/events.model')

//#region apis
const axios = require('axios').default
const moonApi = axios.create({
  baseURL: 'https://api.farmsense.net/v1/moonphases/',
  timeout: 3000,
})
const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/',
  timeout: 3000,
})
const imgApi = axios.create({
  baseURL: 'http://astrobin.com/api/v1/image',
  timeout: 20000,
})
const INTERCEPT_AXIOS = false

if (INTERCEPT_AXIOS) {
  weatherApi.interceptors.request.use((request) => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })

  weatherApi.interceptors.response.use((response) => {
    console.log('Received response:', JSON.stringify(response, null, 2))
    return response
  })
}
//#endregion

//#region helpers
const buildTimelineDTO = (event) => {
  return {
    _id: event._id,
    date: event.date,
    title: event.title,
  }
}
const filterNearestDayWeatherData = (weather, date) => {
  console.log(weather)
  console.log('filterNearestDayWeatherData')
  const dateTimestamp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  ).getTime()

  const exactDayIndex = weather.daily.findIndex((x) => x.dt === dateTimestamp)
  console.log('************ dayIndex: ', exactDayIndex)
  if (exactDayIndex !== -1) {
    console.log(
      '************ ¡exact day!: ',
      weather.daily[exactDayIndex].weather.description
    )
    return weather.daily[exactDayIndex].weather.description
  } else {
    const nextDay = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    )
    console.log(
      '************ NO exact day, current day: ' +
        new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        ) +
        '\n ;  next day: ' +
        nextDay
    )
    for (let day of weather.daily) {
      console.log('------ current day timeStamp: ', date)
      let d = new Date(day.dt * 1000)
      console.log('------ day: ', d)
      console.log('------ next day timeStamp: ', nextDay)

      if (d >= date && d <= nextDay) {
        console.log('------ ENCONTRADO: ', day.weather)
        return day.weather[0].description
      }
    }

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
  console.log('GET LAST EVENTS')
  const now = new Date(Date.now())
  console.log(now)
  try {
    const event = await eventsModel
      .find({ date: { $gte: now } })
      .sort({ date: 1 })
      .limit(4)
    console.log(event)
    res.status(200).json(event)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}
async function getTimelineDTOs(req, res) {
  console.log(
    'getTimelineDTOs ',
    JSON.stringify(req.params, null, 2),
    req.query
  )
  const categoryName = req.params.categoryName
  const limit = parseInt(req.query.limit)
  const page = parseInt(req.query.page)

  try {
    let events = await eventsModel
      .find(categoryName === 'all' ? {} : { category: categoryName })
      .limit(limit)
      .skip(limit * page)

    console.log('timeline events: ', events)
    events = events.map((event) => buildTimelineDTO(event))
    console.log('timeline dtos: ', events)

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
    ).data[0].Phase

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
    searchParams['limit'] = 10
    searchParams['offset'] = Math.floor(Math.random() * 100)
    console.log(searchParams)

    const imageData = (
      await imgApi.get('/', {
        params: searchParams,
      })
    ).data
    //console.log(imageData)
    if (!imageData || imageData.objects.len === 0) {
      res.status(404).json("event's image not found")
    }

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

    const latitude = req.query.lat
    const longitude = req.query.lon

    const weather = (
      await weatherApi.get('onecall', {
        params: {
          lat: latitude,
          lon: longitude,
          appid: process.env.WEATHER_API_KEY,
        },
      })
    ).data
    console.log(weather)
    const data = filterNearestDayWeatherData(weather, event.date)
    console.log('data after filter: ', data)
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
