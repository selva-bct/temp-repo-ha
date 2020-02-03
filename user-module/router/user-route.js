import UserController from '../controller/user-controller'
import { validateToken } from './../service/authentication-service'
import express from 'express'

const userRouter = express.Router()
const userController = new UserController()

userRouter
  .post('/login', userController.authenticate.bind(userController))
  .get('/:id', userController.getUser.bind(userController))
  .get('/', validateToken, userController.getUserList.bind(userController))
  .put('/:id', validateToken, userController.updateUser.bind(userController))
  .post('/', validateToken, userController.register.bind(userController))

  .post('/change-password', validateToken, userController.changePassword.bind(userController))
  .post('/invite', validateToken, userController.inviteUser.bind(userController))

  .post('/forgot-password', userController.forgotPassword.bind(userController))
  .post('/reset-password', userController.resetPassword.bind(userController))
  .get('/token/:inviteToken', userController.getUserByToken.bind(userController))

module.exports = userRouter
