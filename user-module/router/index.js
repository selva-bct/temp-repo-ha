const express = require('express')

const userRoute = require('./user-route')
const mainRouter = express.Router()

mainRouter.use('/users', userRoute)

export default mainRouter
