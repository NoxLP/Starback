const router = require('express').Router()
const { authUser } = require('../utils')
const {
  postComment,
  getAllComments,
  editComment,
  deleteComment,
  replyComment,
  editReply,
  deleteReply,
} = require('../controllers/comments.controller')

router.get('/:eventId', authUser, getAllComments)

router
  .put('/:commentId/events/:eventId', authUser, editComment)
  .put('/reply', authUser, editReply)

router
  .delete('/:commentId/events/:eventId', authUser, deleteComment)
  .delete('/reply', authUser, deleteReply)

router.post('/reply', authUser, replyComment).post('/', authUser, postComment)

module.exports = router
