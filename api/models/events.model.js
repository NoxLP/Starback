const Mongoose = require('mongoose')
const eventSchema = new Mongoose.Schema({
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
    type: String,
    enum: [
      'eclipsesMoon',
      'eclipsesSun',
      'planets',
      'meteorShowers',
      'comets',
      'conjunctions',
    ],
    required: true,
  },
  moon: {
    type: String,
    //********************
    // OJO -> TODO find enum values in api
    /*enum: [
      'Nueva',
      'Cuarto creciente',
      'Gibosa creciente',
      'Llena',
      'Gibosa menguante',
      'Cuarto menguante',
    ],*/
    required: true,
  },
  weather: {
    type: String,
    //********************
    // OJO -> TODO find enum values in api
    //enum: []
    required: true,
  },
  comments: {
    type: [Mongoose.Types.ObjectId],
    required: false,
  },
  origData: {
    type: Mongoose.Types.ObjectId,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
})

const eventModel = Mongoose.model('event', eventSchema)

module.exports = eventModel
