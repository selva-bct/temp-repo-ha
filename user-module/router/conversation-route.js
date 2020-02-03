import ConversationController from '../controller/conversation-controller'
import express from 'express'

const conversationRouter = express.Router()
const conversationController = new ConversationController()

conversationRouter
  .post('/', conversationController.addConversation.bind(conversationController))
  .get('/:testRequestId', conversationController.getConversationList.bind(conversationController))

module.exports = conversationRouter
