import AuthController from './../controller/auth-controller'
import express from 'express'

const authRouter = express.Router()
const authController = new AuthController()
// const authController = AuthController
authRouter
  // .post('/', authController.authenticate)
  .post('/signup', authController.register.bind(authController))
//     .post('/changePassword', authController.changePassword)
//     .get('/validateToken', authController.validateToken)
//     .post('/firstTimeChangePassword', authController.firstTimeChangePassword)
//     // .post('/confirmUser', authController.adminConfirmSignup)

module.exports = authRouter
