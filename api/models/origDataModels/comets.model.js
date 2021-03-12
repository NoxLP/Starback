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
    type: Date,
    required: true,
  },
  visibleUntil: {
    type: Date,
    required: true,
  },
  highest: {
    type: Date,
    required: true,
  },
  ra: {
    type: String,
    required: true,
  },
})

const cometsModel = Mongoose.model('comets', cometsSchema)
module.exports = cometsModel
