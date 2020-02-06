const express = require('express')

const userRoute = require('./user-route')
const roleRoute = require('./role-route')
const messageRoute = require('./message-route')
const InvitationRoute = require('./invitation-route')

const mainRouter = express.Router()

mainRouter.use('/users', userRoute)
mainRouter.use('/role', roleRoute)
mainRouter.use('/message', messageRoute)
mainRouter.use('/invite', InvitationRoute)

export default mainRouter
