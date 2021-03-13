const userModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function signUp(req, res) {
  console.log('signup ', req.body)
  if (req.body && req.body.password) {
    const encryptedPasswd = bcrypt.hashSync(req.body.password, 10)
    console.log(encryptedPasswd)
    req.body.password = encryptedPasswd
    userModel
      .create(req.body)
      .then((user) => {
        const data = { email: user.email, user: user.user }
        const token = jwt.sign(data, process.env.SECRET)
        console.log('signup ok, token: ', token)
        res.status(200).json({ token: token, ...data })
      })
      .catch((err) => {
        console.log('error in signup: ', err)
        res.status(500).json(err)
      })
  }
}

function login(req, res) {
  console.log('login ', req.body)
  userModel
    .findOne({
      email: req.body.email,
    })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const data = { email: user.email, user: user.user }
          const token = jwt.sign(data, process.env.SECRET, {expiresIn: '1d'})

          res.status(200).json({ token: token, ...data })
        } else {
          res.send('passwords do not match')
        }
      } else {
        res.send('User email not found')
      }
    })
    .catch((err) => res.status(500).json(err))
}

module.exports = {
  signUp,
  login,
}
