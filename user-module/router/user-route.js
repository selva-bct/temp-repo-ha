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
  // change this to get
  .post('/getUser', userController.getUser.bind(userController))
  // route name should be changed
  .get('/getUserList', userController.getUserList.bind(userController))
  .put('/updateUser', userController.updateUser.bind(userController))
  .post('/invite', userController.inviteUser.bind(userController))
  .get('/token/:inviteToken', userController.getUserByToken.bind(userController))

module.exports = userRouter
