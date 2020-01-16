import UserController from '../controller/user-controller'
import express from 'express'

const userRouter = express.Router()
const userController = new UserController()

userRouter
  .post('/login', userController.authenticate.bind(userController))
  .post('/', userController.register.bind(userController))
  .post('/change-password', userController.validateToken, userController.changePassword.bind(userController))
  .post('/forgot-password', userController.forgotPassword.bind(userController))

module.exports = userRouter
