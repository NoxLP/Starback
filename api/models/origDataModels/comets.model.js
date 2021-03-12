const Mongoose = require('mongoose')
const cometsSchema = new Mongoose.Schema({
  object: {
    type: String,
    required: true,
  },
  peDate: {
    type: String,
    required: true,
  },
  peRa: {
    type: String,
    required: true,
  },
  peDec: {
    type: String,
    required: true,
  },
  peCons: {
    type: String,
    required: true,
  },
  paMa: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  constellation: {
    type: String,
    required: true,
  },
  visibleFrom: {
    type: String,
    required: true,
  },
  visibleUntil: {
    type: String,
    required: true,
  },
  highest: {
    type: String,
    required: true,
  },
  ra: {
    type: String,
    required: true,
  },
})

const cometsModel = Mongoose.model('comets', cometsSchema)
module.exports = cometsModel
