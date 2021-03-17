const usersModel = require('../models/users.model')

function getUser(req, res) {
  console.log('get user')
  usersModel
    .findById(res.locals.user._id)
    .then((user) => {
      console.log('got user: ', user)

      let { _id, password, ...result } = user._doc
      res.status(200).json(result)
    })
    .catch((err) => {
      res.status(404).send(err)
      console.log('User not found: ', err)
    })
}
function putAddFavourite(req, res) {
  usersModel
    .findById(res.locals.user._id)
    .then((user) => {
      if (!user.favourites) user['favourites'] = []
      user.favourites.push(req.params.eventId)
      user.save()
      res.status(200).json('Ok')
      console.log('Evento favorito añadido')
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log('Error añadiendo evento favorito: ', err)
    })
}

module.exports = {
  getUser,
  putAddFavourite,
}
