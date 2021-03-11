const router = require('express').Router()
const { authUser } = require('../utils')
const {
  postComment,
  getAllComments,
  editComment,
  deleteComment,
  responseComment,
} = require('../controllers/comments.controller')

router.post('/', postComment)
router.get('/:eventId', getAllComments)
router.put('/:commentId/', editComment)
router.delete('/:commentId', deleteComment)
router.post('/:commentId', responseComment)

module.exports = router
