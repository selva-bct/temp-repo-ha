import { logger } from '../config/logger'
import connection from '../config/db-conection'

export class MessageService {
  constructor () { }

  async addMessage (message) {
    try {
      return await connection.models.Message.create(message)
    } catch (error) {
      logger.error('Error while adding message ', error)
      throw error
    }
  }

  async getMessageById (msgId) {
    try {
      return await connection.models.Message.findOne({ where: { msgId: msgId } })
    } catch (error) {
      logger.error('Error while getting message ', error)
      throw error
    }
  }

  async updateMessage (message) {
    try {
      return await connection.models.Message.update(message, { where: { msgId: message.msgId } })
    } catch (error) {
      logger.error('Error while updating message ', error)
      throw error
    }
  }

  async getMessageCount (userId) {
    try {
      return await connection.models.Message.count({ where: { userId: userId } })
    } catch (error) {
      logger.error('Error while getting message count', error)
      throw error
    }
  }
}
