const commentsModel = require('./models/comments.model')

function postComment(req, res){
    commentsModel
        .create(req.body)
        .then((comment)=>{
            console.log('Comentario creado', comment)
            res.status(200).json(comment)
        })
        .catch((err)=>{
            res.status(500).send(err)
            console.log('Error creando comentario')
        })
}

function getAllComments(req, res){
    commentsModel
        .find()
        .then((comments)=>{
            console.log('Comentarios cargados', comments)
            res.status(200).json(comments)
        })
        .catch((err)=>{
            res.status(500).send(err)
            console.log('Error recuperando comentarios')
        })
}

function deleteComment(req, res){
    commentsModel
        .findById()
}