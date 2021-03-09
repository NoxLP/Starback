const Mongoose = require('mongoose')
const planetsSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
})

const planetsModel = Mongoose.model('planets', planetsSchema)
