const usersModel = require('../models/users.model')

async function putAddFavourite(req, res) {
  console.log('putAddFavourite ', req.body)
  try {
    const event = await usersModel.findById(req.body.event)
    const favourite = req.body
    console.log(event)

    event.favourites.push(favourite)
    await event.save()

    console.log('Evento favorito añadido', favourite)
    res.status(200).json(favourite)
  } catch (err) {
    res.status(500).send(err)
    console.log('Error añadiendo evento favorito: ', err)
  }
}

module.exports = {
  putAddFavourite,
}
