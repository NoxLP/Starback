const router = require('express').Router()

const authRouter = require('./auth.router')
const eventsRouter = require('./events.router')
const commentsRouter = require('./comments.router')
const { authUser } = require('../utils') // Authenticated Route

router.use('/auth', authRouter)
router.use('/events', authUser, eventsRouter)
router.use('/comments', authUser, commentsRouter)

module.exports = router
