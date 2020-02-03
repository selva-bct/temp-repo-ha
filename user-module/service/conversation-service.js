import { logger } from '../config/logger'
import connection from '../config/db-conection'

export class ConversationService {
  constructor () { }

  async addConversation (conversation) {
    try {
      return await connection.models.Conversation.create(conversation)
    } catch (error) {
      logger.error('Error while adding conversation ', error)
      throw error
    }
  }

  async getConversationList (userId, testRequestId) {
    try {
      return await connection.models.Conversation.findAll({
        where: { testRequestId: testRequestId, 'members->userId': userId }
      })
    } catch (error) {
      logger.error('Error while conversation List ', error)
      throw error
    }
  }
}
