import { logger } from '../config/logger'
import { ResponseService, MessageService } from '../service'
import { defaultMessage } from '../constant/constant'

class MessageController {
  constructor () {
    this.responseService = new ResponseService()
    this.messageService = new MessageService()
  }

  async addMessage (req, res) {
    try {
      logger.info('Adding new message')
      const message = req.body
      if (!message) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const data = await this.messageService.addMessage(message)
      logger.info('Created message successfully')
      this.responseService.onSuccess(res, 'Created message successfully', data)
    } catch (error) {
      logger.error(error, 'Error while creating message')
      this.responseService.onError(res, error)
    }
  }

  async updateMessage (req, res) {
    try {
      logger.info('Updating message status')
      const { message } = req.body
      if (!message) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const messageInfo = await this.messageService.getMessageById(message.msgId)
      if (!messageInfo) {
        return this.responseService.onError(res, defaultMessage.NOT_FOUND)
      }
      await this.messageService.updateMessage(message)
      logger.info('Message updated successfully')
      this.responseService.onSuccess(res, 'Message updated successfully')
    } catch (error) {
      logger.error(error, 'Error while updating message')
      this.responseService.onError(res, error)
    }
  }

  async getMessages (req, res) {
    try {
      logger.info('Getting message by combinations of Ids')
      const { id } = req.params
      const data = await this.messageService.getMessage(id)
      logger.info('Successfully fetched messages')
      this.responseService.onSuccess(res, 'Successfully fetched messages', data)
    } catch (error) {
      logger.error(error, 'Error while getting message')
      this.responseService.onError(res, error)
    }
  }

  async getMessageCount (req, res) {
    try {
      logger.info('Getting messages count ')
      const { id } = req.params
      const data = await this.messageService.getMessageCount(id)
      logger.info('Successfully fetched messages count')
      this.responseService.onSuccess(res, 'Successfully fetched messages count', data)
    } catch (error) {
      logger.error(error, 'Error while getting message count')
      this.responseService.onError(res, error)
    }
  }
}

module.exports = MessageController
