const router = require('express').Router()
const { authUser } = require('../utils')
const {
  postComment,
  getAllComments,
  editComment,
  deleteComment,
  responseComment,
} = require('../controllers/comments.controller')

router.post('/', authUser, postComment)
router.get('/:eventId', authUser, getAllComments)
router.put('/:commentId/', authUser, editComment)
router.delete('/:commentId', authUser, deleteComment)
router.post('/:commentId', authUser, responseComment)

module.exports = router
