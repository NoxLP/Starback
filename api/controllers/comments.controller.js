const { commentsModel } = require('../models/comments.model')
const eventModel = require('../models/events.model')
const eventsModel = require('../models/events.model')

function paginate(array, limit, page) {
  /*
  Limit 0   Page 0 ==> slices(0,0)
  Limit 1   Page 0 ==> slices(0,1)
  Limit 1   Page 1 ==> slices(1,2)
  */
  limit = parseInt(limit)
  page = parseInt(page)
  return array.slice(page * limit, (page + 1) * limit)
}

async function postComment(req, res) {
  console.log('postComment ', req.body)
  try {
    const event = await eventsModel.findById(req.body.event)
    const comment = req.body
    console.log(event)
    event.comments.push(comment)
    await event.save()

    console.log('Comentario creado', comment)
    res.status(200).json(comment)
  } catch (err) {
    res.status(500).send(err)
    console.log('Error creando comentario: ', err)
  }
}

function getAllComments(req, res) {
  eventsModel
    .findById(req.params.eventId)
    .then((event) => {
      console.log(event)
      console.log(req.query)
      const comments = paginate(event.comments, req.query.limit, req.query.page)
      console.log('Comentarios cargados', comments)
      res.status(200).json(comments)
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log('Error recuperando comentarios: ', err)
    })
}

function editComment(req, res) {
  commentsModel
    .findByIdAndUpdate(req.params.commentId, req.body, {
      new: true,
      runValidators: true,
    })
    .then((comment) => {
      console.log('Comentario editado', comment)
      res.status(200).json(comment)
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log('Error al editar el comentario: ', err)
    })
}

async function deleteComment(req, res) {
  try {
    let event = await eventModel.findById(req.body.event)
    /*
    let index = event.comments.findIndex(x => x._id === req.params.commentId)
    if (index === -1) {
      let err = `Comentario no existe en evento con id: ${req.body.event}`
      console.log(err)
      res.status(500).send(err)
    }
    const comment = event.comments[index]

    event.comments.splice(index, 1)
    console.log('comment removed: ', event.comments)*/

    event.comments.pull(comment._id)
    //comment.remove()

    await event.save()
    res.status(200).json(comment)
  } catch (err) {
    console.log('Error al borrar el comentario: ', err)
    res.status(500).send(err)
  }
}

async function responseComment(req, res) {
  try {
    let response = commentsModel.create(req.body)
    let parent = commentsModel.findById(req.params.commentId)

    let responseComment = await Promise.all([response, parent])
    response = responseComment[0]
    parent = responseComment[1]
    parent.responses.push(response)
    await parent.save()

    console.log('Respuesta creada', response)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).send(err)
    console.log('Error creando respuesta: ', err)
  }
}

module.exports = {
  postComment,
  getAllComments,
  editComment,
  deleteComment,
  responseComment,
}
