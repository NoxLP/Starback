const Mongoose = require('mongoose')
const eventsSchema = new Mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Enumerator,
    required: true,
  },
  moon: {
    type: Enumerator,
    required: true,
  },
  weather: {
    type: Enumerator,
    required: true,
  },
  /*
    comments: {
      type: objectId,
      requiered: true
    }
    */
})

const eventsModel = Mongoose.model('events', eventsSchema)

module.exports = eventsModel
