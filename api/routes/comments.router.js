const router = require('express').Router()
const { authUser } = require('../utils')
const { postComment,
        deleteComment,
        editComment,
        getAllComments 
    } = require('../controllers/comments.controller')

router.post('/', postComment)
router.delete('/:commentId', deleteComment)
router.put('/:commentId/', editComment)
router.get('/', getAllComments)

module.exports = router