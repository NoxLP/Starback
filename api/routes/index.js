const router = require('express').Router()

const authRouter = require('./auth.router')
const eventsRouter = require('./events.router')
const commentsRouter = require('./comments.router')
const usersRouter = require('./users.router')
const { authUser } = require('../utils/index') // Authenticated Route

router.use('/auth', authRouter)
router.use('/events', authUser, eventsRouter)
router.use('/comments', authUser, commentsRouter)
router.use('/users', authUser, usersRouter)

module.exports = router
