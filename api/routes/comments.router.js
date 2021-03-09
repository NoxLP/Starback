const router = require('express').Router()
const { authUser } = require('../utils')
const { postComment,
        deleteComment,
        editComment,
        getAllComments 
    } = require('../controllers/comments.controller')

router.post('/comments', postComment)
router.delete('/comments/:commentId', deleteComment)
router.put('/comments/:commentId/', editComment)
router.get('/comments', getAllComments)

module.exports = router