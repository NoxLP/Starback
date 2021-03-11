const commentsModel = require('./models/comments.model')
const eventsModel = require('./models/events.model')

function postComment(req, res) {
  try {
    let create = commentsModel.create(req.body)
    let find = eventsModel.findById(req.body.event)
      
    let commentEvent = await Promise.all([create, find])
      let comment = commentEvent[0]
      let event = commentEvent[1]
      event.comments.push(comment)
      await event.save()
    
    console.log('Comentario creado', comment)
    res.status(200).json(comment)
  } catch (err) {
      
    res.status(500).send(err)
    console.log('Error creando comentario')
  }
}

function getAllComments(req, res) {
  commentsModel
    .findById(req.params.eventId).limit(req.query.limit).skip(req.query.limit * req.query.page)
    .then((comments) => {
      console.log('Comentarios cargados', comments)
      res.status(200).json(comments)
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log('Error recuperando comentarios')
    })
}

function editComment(req, res) {
    commentsModel
    .findByIdAndUpdate(req.params.commentId, req.body, {
        new: true,
        runValidators: true
    })
    .then((comment) => {
      console.log('Comentario editado', comment)
      res.status(200).json(comment)
    })
    .catch((err) => {
      res.status(500).send(err)
      console.log('Error al editar el comentario')
    })
}
