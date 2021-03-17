const userModel = require('../models/users.model')

function putAddFavourite(req, res) {
  userModel
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
  putAddFavourite,
}
