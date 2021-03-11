const router = require('express').Router()
const { authUser } = require('../utils')
const {
  postComment,
  getAllComments,
  editComment,
  deleteComment,
  replyComment,
} = require('../controllers/comments.controller')

router.post('/', authUser, postComment)
router.get('/:eventId', authUser, getAllComments)
router.put('/:commentId/events/:eventId', authUser, editComment)
router.delete('/:commentId/events/:eventId', authUser, deleteComment)
router.post('/:commentId/events/:eventId', authUser, replyComment)

module.exports = router
