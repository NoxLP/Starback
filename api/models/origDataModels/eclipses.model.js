const Mongoose = require('mongoose')
const eclipsesSchema = new Mongoose.Schema({
  sl: {
    type: String,
    enum: ['Lunar', 'Solar'],
    required: true,
  },
  type: {
    type: String,
    enum: ['Total', 'Annular', 'Partial', 'Hybrid', 'Appulse'],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  coorsZodiac: {
    type: String,
    required: true,
  },
  magnitude: {
    type: Number,
    required: true,
  },
})

const eclipsesModel = Mongoose.model('eclipses', eclipsesSchema)
module.exports = eclipsesModel
