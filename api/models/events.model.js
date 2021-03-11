const Mongoose = require('mongoose')
const { commentsSchema } = require('./comments.model')

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
  comments: {
    type: [commentsSchema],
    required: false,
  },
  origData: {
    type: Mongoose.Types.ObjectId,
    // required: true,
  },
})

const eventsModel = Mongoose.model('event', eventSchema)

module.exports = eventsModel
