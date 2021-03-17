const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, 'User name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: {
      validator(value) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          value
        )
      },
    },
    unique: [true, 'This is email is registered'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  surname: String,
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  job: {
    type: String,
    enum: ['Estudiante', 'Aficionado', 'Astrónomo'],
  },
  birthDate: Date,
  favourites: {
    type: [mongoose.Types.ObjectId],
  },
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel
