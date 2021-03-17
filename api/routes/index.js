const router = require('express').Router()

const authRouter = require('./auth.router')
const eventsRouter = require('./events.router')
const commentsRouter = require('./comments.router')
const { authUser } = require('../utils/index') // Authenticated Route

router.use('/status', status)
router.use('/auth', authRouter)
router.use('/events', authUser, eventsRouter)
router.use('/comments', authUser, commentsRouter)

module.exports = router

function status(req, res) {
  res.status(200).json("I'm alive, thanks for asking.\n\nBye!")
}
