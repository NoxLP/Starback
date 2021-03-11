const Mongoose = require('mongoose')
const commentsSchema = new Mongoose.Schema({
  user: {
    type: Mongoose.Types.ObjectId,
    required: true,
  },
  event: {
    type: Mongoose.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  responses: {
    type: [this],
  },
  likes: {
    type: [Mongoose.Types.ObjectId],
  },
  date: {
    type: Date,
    required: true,
  },
})

const commentsModel = Mongoose.model('comments', commentsSchema)

module.exports = {
  commentsModel,
  commentsSchema,
}
