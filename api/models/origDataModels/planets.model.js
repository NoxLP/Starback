const Mongoose = require('mongoose')
const planetsSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  z: {
    type: Number,
    required: true,
  },
  ra: {
    type: Number,
    required: true,
  },
  dec: {
    type: Number,
    required: true,
  },
  mag: {
    type: Number,
    required: true,
  },
  phase: {
    type: Number,
    required: true,
  },
  ang: {
    type: Number,
    required: true,
  },
})

const planetsModel = Mongoose.model('planets', planetsSchema)

module.exports = planetsModel
