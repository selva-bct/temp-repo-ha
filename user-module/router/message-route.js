import MessageController from '../controller/message-controller'
import { validateToken } from './../service/authentication-service'
import express from 'express'

const messageRouter = express.Router()
const messageController = new MessageController()

messageRouter
  .post('/', validateToken, messageController.addMessage.bind(messageController))
  .put('/', validateToken, messageController.updateMessage.bind(messageController))
  .get('/:id/count', validateToken, messageController.getMessageCount.bind(messageController))

module.exports = messageRouter
