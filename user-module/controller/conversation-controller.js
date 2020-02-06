import { logger } from '../config/logger'
import { ResponseService } from '../service'
import { defaultMessage } from '../constant/constant'
import { Conversation } from '../models/conversation'

class ConversationController {
  constructor () {
    this.responseService = new ResponseService()
  }

  async addConversation (req, res) {
    try {
      logger.info('Adding new conversation')
      const conversation = req.body
      if (!conversation) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      console.log('conversation --->', conversation)
      const data = await Conversation.create(conversation)
      logger.info('Created conversation successfully')
      this.responseService.onSuccess(res, 'Created conversation successfully', data)
    } catch (error) {
      logger.error(error, 'Error while creating conversation')
      this.responseService.onError(res, error)
    }
  }

  async getConversationList (req, res) {
    try {
      logger.info('Getting conversation list')
      const { userId, testRequestId } = req.params
      const data = await Conversation.findAll({ where: { testRequestId: testRequestId, 'members->userId': userId } })
      logger.info('Successfully fetched conversation')
      this.responseService.onSuccess(res, 'Successfully fetched conversation', data)
    } catch (error) {
      logger.error(error, 'Error while getting conversation')
      this.responseService.onError(res, error)
    }
  }
}

module.exports = ConversationController
