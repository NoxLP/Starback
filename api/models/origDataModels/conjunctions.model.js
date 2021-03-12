const Mongoose = require('mongoose')

const conjunctionsSchema = new Mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  planet1: {
    type: String,
    required: true,
  },
  planet2: {
    type: String,
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
  raConjAngle: {
    type: Number,
    required: true,
  },
  decConjAngle: {
    type: Number,
    required: true,
  },
  mag: {
    type: Number,
    required: true,
  },
})

const conjunctionsModel = Mongoose.model('event', conjunctionsSchema)

module.exports = conjunctionsModel
