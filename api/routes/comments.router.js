const router = require('express').Router()
const {
  postComment,
  getAllComments,
  editComment,
  deleteComment,
  replyComment,
  editReply,
  deleteReply,
} = require('../controllers/comments.controller')

router.get('/:eventId', getAllComments)

router.put('/:commentId/events/:eventId', editComment).put('/reply', editReply)

router
  .delete('/:commentId/events/:eventId', deleteComment)
  .delete('/reply', deleteReply)

router.post('/reply', replyComment).post('/', postComment)

module.exports = router
