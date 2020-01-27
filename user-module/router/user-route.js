import UserController from '../controller/user-controller'
import express from 'express'

const userRouter = express.Router()
const userController = new UserController()

userRouter
  .post('/login', userController.authenticate.bind(userController))
  .post('/', userController.register.bind(userController))
  .post('/change-password', userController.changePassword.bind(userController))
  .post('/forgot-password', userController.forgotPassword.bind(userController))
  .post('/reset-password', userController.resetPassword.bind(userController))

  .post('/getUser', userController.getUser.bind(userController))
  .put('/updateUser', userController.updateUser.bind(userController))
  .get('/getUserList', userController.getUserList.bind(userController))

module.exports = userRouter
