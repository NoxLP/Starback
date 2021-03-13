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

function replyComment(req, res) {
  console.log('replyComment')
  eventsModel
    .findById(req.query.eventId)
    .then((event) => {
      const parent = event.comments.id(req.query.parentId)
      parent.responses.push(req.body)
      const index = parent.responses.indexOf(req.body)
      parent.responses[index]['index'] = index
      event
        .save()
        .then((somevent) => {
          res.status(200).json(parent.responses[index])
        })
        .catch((err) => {
          res.status(500).send(err)
          console.log('Error', err)
        })
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log('Error cargando respuestas: ', err)
    })
}

function editReply(req, res) {
  console.log('editReply ', req.body)
  eventsModel
    .findById(req.query.eventId)
    .then((event) => {
      const parent = event.comments.id(req.query.parentId)
      const child = parent.responses[req.query.index]
      child.text = req.body.text
      parent.markModified('responses' + req.query.index)
      event
        .save()
        .then((somevent) => {
          res.status(200).json(child)
        })
        .catch((err) => {
          res.status(500).send(err)
          console.log('Error', err)
        })
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log('Error editando respuesta: ', err)
    })
}

function deleteReply(req, res) {
  console.log('deleteReply')
  eventsModel
    .findById(req.query.eventId)
    .then((event) => {
      const parent = event.comments.id(req.query.parentId)
      const child = parent.responses[req.query.index]
      parent.responses.splice(req.query.index, 1)
      parent.markModified('responses' + req.query.index)
      event
        .save()
        .then((somevent) => {
          res.status(200).json(child)
        })
        .catch((err) => {
          res.status(500).send(err)
          console.log('Error', err)
        })
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log('Error eliminando respuesta: ', err)
    })
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

const findCommentIndex = (event, commentId, eventId) => {
  let comment = event.comments.id(commentId)
  // console.log('comment: ', comment)

  if (!comment) {
    return -1
  }

  let index = event.comments.indexOf(comment)
  return index
}
async function editComment(req, res) {
  try {
    const event = await eventsModel.findById(req.params.eventId)
    const comment = event.comments.id(req.params.commentId)
    // console.log('comment: ', comment)

    if (!comment) {
      const err = `Comentario no existe en evento con id: ${req.params.eventId}`
      console.log(err)
      res.status(500).send(err)
      return
    }

    let index = event.comments.indexOf(comment)
    event.comments[index].text = req.body.text

    await event.save()
    res.status(200).json(comment)
  } catch (err) {
    res.status(500).send(err)
    console.log('Error al editar el comentario: ', err)
  }
}

async function deleteComment(req, res) {
  try {
    console.log('deleteComment')
    let event = await eventsModel.findById(req.params.eventId)
    // console.log('params: ', req.params)
    // console.log('event: ', event)
    // console.log('comments: ', event.comments)

    let comment = event.comments.id(req.params.commentId)
    // console.log('comment: ', comment)

    if (!comment) {
      let err = `Comentario no existe en evento con id: ${req.params.eventId}`
      console.log(err)
      res.status(500).send(err)
      return
    }

    let index = event.comments.indexOf(comment)
    event.comments.splice(index, 1)
    console.log('comment removed: ', event.comments)

    //event.comments.pull(comment._id)
    //comment.remove()

    await event.save()
    res.status(200).json(comment)
  } catch (err) {
    console.log('Error al borrar el comentario: ', err)
    res.status(500).send(err)
  }
}

/*async function replyComment(req, res) {
  try {
    let response = commentsModel.create(req.body)
    let parent = commentsModel.findById(req.params.commentId)

    let replyComment = await Promise.all([response, parent])
    response = replyComment[0]
    parent = replyComment[1]
    parent.responses.push(response)
    await parent.save()

    console.log('Respuesta creada', response)
    res.status(200).json(response)
  } catch (err) {
    res.status(500).send(err)
    console.log('Error creando respuesta: ', err)
  }
}*/

module.exports = {
  postComment,
  getAllComments,
  editComment,
  deleteComment,
  replyComment,
  editReply,
  deleteReply,
}
