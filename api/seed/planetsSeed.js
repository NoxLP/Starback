process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
require('dotenv').config({ path: '../../.env' })
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

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

const planetsModel = require('../models/origDataModels/planets.model')

;(async function buildPlanetsEvents_2021_2022() {
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

  let filtered = await Promise.all(
    findObjects.map((obj) => planetsModel.find(obj).sort({ mag: 1 }).limit(1))
  )

  //TODO: just for testing, deleteme *********/
  fs.writeFileSync(
    './testPlanets.json',
    JSON.stringify(filtered.flat(5), null, 2)
  )
  //console.log(filtered)
  //******************************************/

  mongoose.connection.close()
})()
