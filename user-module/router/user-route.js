import UserController from '../controller/user-controller'
import express from 'express'

const userRouter = express.Router()
const userController = new UserController()

userRouter
  .post('/login', userController.authenticate.bind(userController))
  .post('/', userController.register.bind(userController))
  .post('/change-password', userController.changePassword.bind(userController))
  .post('/forgot-password', userController.forgotPassword.bind(userController))
  .get('/validateToken', userController.validateToken.bind(userController))
  .post('/first-time-change-password', userController.firstTimeChangePassword.bind(userController))
//     // .post('/confirmUser', userController.adminConfirmSignup)

module.exports = userRouter
