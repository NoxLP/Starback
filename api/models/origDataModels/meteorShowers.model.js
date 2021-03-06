const Mongoose = require('mongoose')
const meteorShowersSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateMin: {
    type: String,
    required: true,
  },
  dateMax: {
    type: String,
    required: true,
  },
  peak: {
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
  zhr: {
    type: Number,
    required: true,
  },
  rating: {
    type: String,
    enum: ['bright', 'medium', 'faint'],
    required: true,
  },
  parentBody: {
    type: String,
    required: true,
  },
})

const meteorShowersModel = Mongoose.model('meteor_showers', meteorShowersSchema)
module.exports = meteorShowersModel
