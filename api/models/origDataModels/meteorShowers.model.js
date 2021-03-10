const Mongoose = require('mongoose')
const meteorShowersSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateMin: {
    type: Date,
    required: true,
  },
  dateMax: {
    type: String,
    required: true,
  },
  peak: {
    type: Date,
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
    enum: ['bright', 'medium', 'faint'],
    required: true,
  },
  parentBody: {
    type: String,
    required: true,
  },
})

const meteorShowersModel = Mongoose.model('meteorShowers', meteorShowersSchema)
module.exports = meteorShowersModel
