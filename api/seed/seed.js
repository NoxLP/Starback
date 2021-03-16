process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
require('dotenv').config({ path: '../../.env' })
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

const planetsModel = require('../models/origDataModels/planets.model')
const cometsModel = require('../models/origDataModels/comets.model')
const eclipsesModel = require('../models/origDataModels/eclipses.model')
const meteorShowersModel = require('../models/origDataModels/meteorShowers.model')
const conjunctionsModel = require('../models/origDataModels/conjunctions.model')

const eventsModel = require('../models/events.model')

const PLANETS = [
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
]
const PLANETS_PRETTY = [
  'mercurio',
  'venus',
  'marte',
  'júpiter',
  'saturno',
  'urano',
  'neptuno',
  'plutón',
]
const DATE_PRETTY_CONFIG = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

// MONGOOSE
mongoose.connect(
  process.env.MONGO_URL,
  {
    dbName: process.env.MONGO_DB || 'test',
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      throw new Error(err)
    }
    console.info('💾 Connected to Mongo Database \n')
  }
)

//#region helpers
const getPlanetPrettyName = (planet) => PLANETS_PRETTY[PLANETS.indexOf(planet)]
const buildEventTitle = (ephem, category) => {
  let title
  switch (category) {
    case 'planets':
      title = getPlanetPrettyName(ephem.name)
      break
    case 'meteorShowers':
      title = ephem.name
      break
    case 'eclipsesMoon':
      title = 'Eclipse lunar'
      break
    case 'eclipsesSun':
      title = 'Eclipse solar'
      break
    case 'comets':
      title = ephem.object
      break
    case 'conjunctions':
      title = `Alineación ${ephem.planet1} ${ephem.planet2}`
      break
  }
  return title
}
const buildEventDescription = (ephem, category) => {
  //TODO => localizar a español las strings pretinentes
  let description
  switch (category) {
    case 'planets':
      /*console.log('ephem ', ephem)
      console.log('date ', ephem.date)
      console.log('date is ', ephem.date instanceof Date)*/
      description = `${getPlanetPrettyName(
        ephem.name
      )} será visible en ${ephem.date.toLocaleString(
        'es-ES',
        DATE_PRETTY_CONFIG
      )} con magnitud ${ephem.mag}.
Ascensión recta: ${ephem.ra}
Declinación: ${ephem.dec}`
      break
    case 'eclipsesMoon':
      description = `Eclipse ${ephem.type}.
Será visible el ${new Date(ephem.date).toLocaleString(
        'es-ES',
        DATE_PRETTY_CONFIG
      )} a las ${ephem.time} con magnitud ${ephem.magnitude}.
Coordenadas: ${ephem.coorsZodiac}`
      break
    case 'eclipsesSun':
      description = `Eclipse ${ephem.type}.
Será visible el ${new Date(ephem.date).toLocaleString(
        'es-ES',
        DATE_PRETTY_CONFIG
      )} a las ${ephem.time} con magnitud ${ephem.magnitude}.
Coordenadas: ${ephem.coorsZodiac}`
      break
    case 'meteorShowers':
      const min = new Date(ephem.dateMin)
      min.setFullYear(2021)
      const max = new Date(ephem.dateMax)
      max.setFullYear(2021)
      const peak = new Date(ephem.peak)
      peak.setFullYear(2021)
      description = `${ephem.name}.
  Entre ${min.toLocaleString(
    'es-ES',
    DATE_PRETTY_CONFIG
  )} y ${max.toLocaleString(
        'es-ES',
        DATE_PRETTY_CONFIG
      )} con máximo el día ${peak.toLocaleString('es-ES', DATE_PRETTY_CONFIG)}.
Ascensión recta: ${ephem.ra}
Declinación: ${ephem.dec}
Brillo aparente: ${ephem.rating}`
      break
    case 'comets':
      description = `${ephem.object}.
  A partir del ${new Date(ephem.date).toLocaleString(
    'es-ES',
    DATE_PRETTY_CONFIG
  )}.
Perihelio: ${new Date(ephem.peDate).toLocaleString('es-ES', DATE_PRETTY_CONFIG)}
Ascensión recta: ${ephem.ra}
Constelación: ${ephem.constellation}
Visible desde las ${ephem.visibleFrom} hasta las ${ephem.visibleUntil}
Magnitud aparente antes del perihelio: ${ephem.peMa}`
      break
    case 'conjunctions':
      description = `Conjunción de ${ephem.planet1} y ${
        ephem.planet2
      }, el ${ephem.date.toLocaleString('es-ES', DATE_PRETTY_CONFIG)}.
Ascensión recta: ${ephem.ra}
Declinación: ${ephem.dec}
Magnitud aparente: ${ephem.mag}`
      break
  }
  return description
}
const buildMeteorShowersDate = (ephem) => {
  let date = new Date(ephem.dateMin)
  date.setFullYear(2021)
  return date
}
const buildEvent = (ephem, category) => {
  let mydate =
    category === 'meteorShowers'
      ? buildMeteorShowersDate(ephem)
      : new Date(ephem.date)
  console.log(mydate)
  return {
    date: mydate,
    title: buildEventTitle(ephem, category),
    description: buildEventDescription(ephem, category),
    category: category,
    origData: mongoose.Types.ObjectId(ephem._id),
  }
}
//#endregion

//#region build events
async function buildPlanetsEvents_2021_2022() {
  console.log('build planets events\n')

  const dates = [2021, 2022].map((year) => {
    let monthDates = [],
      firstMonth = year === 2021 ? 3 : 0
    for (let month = firstMonth; month < 12; month++) {
      monthDates.push([
        new Date(Date.UTC(year, month, 1)),
        new Date(Date.UTC(year, month + 1, 1)),
      ])
    }
    return monthDates
  })
  //console.log('dates: ', dates)

  const findObjects = PLANETS.map((planet) => {
    return dates.map((yearDates) =>
      yearDates.map((monthDates) => {
        return {
          name: planet,
          date: {
            $gte: monthDates[0],
            $lte: monthDates[1],
          },
        }
      })
    )
  }).flat(5)
  //console.log('find: ', findObjects)
  //console.log('find: ', JSON.stringify(findObjects, null, 2))

  const filteredEphemerides = await Promise.all(
    findObjects.map((obj) => planetsModel.find(obj).sort({ mag: 1 }).limit(1))
  )

  //TODO: just for testing, deleteme *********/
  fs.writeFileSync(
    './testPlanets.json',
    JSON.stringify(filteredEphemerides.flat(5), null, 2)
  )
  //console.log(filteredEphemerides)
  //******************************************/

  /*
  filteredEphemerides = [
    {
      planet_I ephemeride data of day of month_j with maximum(negative) magnitude
    },
    { //example
      "_id": "6048aa5be3b6073d48682bca",
      "name": "mercury",
      "date": "2021-04-19T04:59:59.971Z",
      "x": 0.275349746,
      "y": 0.158031249,
      "z": 0.054770123,
      "ra": 27.38192512695895,
      "dec": 10.689141191372533,
      "mag": -2.33,
      "phase": 0.9998,
      "ang": 5.058474084
    }
    ...
  ]

  each object => new event

  newEvent = {
    date: ephem.date <= new Date
    title: componer string con ephem.name
    description: componer string con el resto de campos de ephem
    category: 'planets'
    origData: ephem
  }
  */

  //https://stackoverflow.com/questions/16726330/mongoose-mongodb-batch-insert

  const events = filteredEphemerides
    .flat(5)
    .map((ephem) => buildEvent(ephem, 'planets'))

  try {
    await eventsModel.insertMany(events)
  } catch (err) {
    console.log('error building planets ', err)
    return false
  }

  return true
}
async function buildCometsEvents() {
  console.log('build comets events')
  try {
    let comets = await cometsModel.find()

    await eventsModel.insertMany(
      comets.map((ephem) => buildEvent(ephem, 'comets'))
    )
  } catch (err) {
    console.log('error building comets ', err)
    return false
  }

  return true
}
async function buildEclipsesEvents() {
  console.log('build eclipses events')
  try {
    let eclipses = await eclipsesModel.find()

    await eventsModel.insertMany(
      eclipses.map((ephem) =>
        buildEvent(ephem, ephem.sl === 'Solar' ? 'eclipsesSun' : 'eclipsesMoon')
      )
    )
  } catch (err) {
    console.log('error building eclipses ', err)
    return false
  }

  return true
}
async function buildMeteorsEvents() {
  console.log('build meteor showers events')
  try {
    let meteorShowers = await meteorShowersModel.find()
    console.log(meteorShowers.length, meteorShowers[0])

    await eventsModel.insertMany(
      meteorShowers.map((ephem) => buildEvent(ephem, 'meteorShowers'))
    )
  } catch (err) {
    console.log('error building meteorS ', err)
    return false
  }

  return true
}
async function buildConjunctionEvents() {
  console.log('build conjunction events')
  try {
    let conjunctions = await conjunctionsModel.find()

    await eventsModel.insertMany(
      conjunctions.map((ephem) => buildEvent(ephem, 'conjunctions'))
    )
  } catch (err) {
    console.log(err)
    return false
  }

  return true
}
//#endregion

;(async function executeSeedScript() {
  await Promise.all([
    buildPlanetsEvents_2021_2022(),
    buildCometsEvents(),
    buildEclipsesEvents(),
    buildMeteorsEvents(),
    buildConjunctionEvents(),
  ])

  await mongoose.connection.close()
})()
