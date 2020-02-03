const express = require('express')

const userRoute = require('./user-route')
const roleRoute = require('./role-route')

const mainRouter = express.Router()

mainRouter.use('/users', userRoute)
mainRouter.use('/role', roleRoute)

export default mainRouter
