const Mongoose = require('mongoose')
const eclipsesSchema = new Mongoose.Schema({
  sl: {
    type: String,
    required: true,
  },
})

const eclipsesModel = Mongoose.model('eclipses', eclipsesSchema)
