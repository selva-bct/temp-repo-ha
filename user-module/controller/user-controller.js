// internal package
import { logger } from '../config/logger'
import { responseService, userService, cognotiService } from '../service'
import {
  defaultStatusCode,
  defaultMessage,
  cognitoUserCreation,
  changePasswordRequest,
  resetPasswordRequest
} from '../constant/constant'

class UserController {
  async authenticate (req, res) {
    try {
      logger.info('Authenticating user')
      const { username, password } = req.body
      if (!(username && password)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const data = await cognotiService.login(username, password)
      cognotiService.resetFailAttempts(username)
      logger.info(defaultMessage.SUCCESS)
      return responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.NOT_AUTHORIZED)
      if (error.name === defaultMessage.NOT_AUTHORIZED_EXCEPTION) {
        return responseService.notAuthorized(res, defaultMessage.NOT_AUTHORIZED, error)
      } else {
        return responseService.onError(res, defaultMessage.INTERNAL_SERVER_ERROR, error)
      }
    }
  }

  async register (req, res, next) {
    try {
      logger.info('User registration')
      const { body: { name, email, password } } = req
      if (!(name && email && password)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const userData = await cognotiService.createUser(name, email, password)
      responseService.onSuccess(res, cognitoUserCreation.SUCCESS, userData, defaultStatusCode.RESOURCE_CREATED)
    } catch (error) {
      logger.error(error, cognitoUserCreation.ERROR)
      if (error.code === defaultMessage.USERNAME_EXIST_EXCEPTION) {
        responseService.conflict(res, cognitoUserCreation.CONFLICT, error)
      } else {
        responseService.onError(res, cognitoUserCreation.ERROR, error)
      }
    }
  }

  async changePassword (req, res) {
    try {
      logger.info('Requesting for change of Password')
      const { oldPassword, newPassword } = req.body
      const { authorization } = req.headers
      if (!(oldPassword && newPassword && authorization)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      await cognotiService.changePassword(oldPassword, newPassword, authorization)
      logger.info(changePasswordRequest.SUCCESS)
      responseService.onSuccess(res, changePasswordRequest.SUCCESS)
    } catch (error) {
      logger.error(error, changePasswordRequest.ERROR)
      responseService.onError(res, cognitoUserCreation.ERROR, error)
    }
  }

  async forgotPassword (req, res) {
    try {
      logger.info('Requesting for resetting the password')
      const { username } = req.body
      if (!(username)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      await cognotiService.forgotPassword(username)
      logger.info(resetPasswordRequest.SUCCESS)
      return responseService.onSuccess(res, resetPasswordRequest.SUCCESS)
    } catch (error) {
      logger.error(error, resetPasswordRequest.ERROR)
      return responseService.onError(res, resetPasswordRequest.ERROR, error)
    }
  }

  async resetPassword (req, res) {
    try {
      logger.info('Requesting for reset of Password')
      const { username, password, confirmationCode } = req.body
      if (!(username && password && confirmationCode)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      await cognotiService.resetPassword(username, password, confirmationCode)
      logger.info(changePasswordRequest.SUCCESS)
      responseService.onSuccess(res, changePasswordRequest.SUCCESS)
    } catch (error) {
      logger.error(error, changePasswordRequest.ERROR)
      responseService.onError(res, cognitoUserCreation.ERROR, error)
    }
  }

  async validateToken (req, res, next) {
    try {
      logger.info('Into verifying user...')
      const { authorization } = req.headers
      if (!(authorization)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const user = await cognotiService.validateToken(authorization)
      if (!user) {
        const error = new Error(defaultMessage.NOT_AUTHORIZED)
        logger.error(error, defaultMessage.NOT_AUTHORIZED)
        responseService.NOT_AUTHORIZED(res, defaultMessage.NOT_AUTHORIZED, defaultStatusCode.NOT_AUTHORIZED)
      }
      logger.info('Successfully verified user...')
      next()
    } catch (error) {
      logger.error(error, defaultMessage.TOKEN_VALIDATION_ERROR)
      next(error)
    }
  }

  async getUser (req, res) {
    try {
      logger.info('Getting user by Email')
      const { username } = req.body
      if (!(username)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const data = await userService.getUser(username)
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async updateUser (req, res) {
    try {
      logger.info('Updating user')
      const user = req.body
      if (!(user)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const userInfo = await userService.getUser(user.username)
      if (!userInfo) {
        const data = await userService.updateUser(user)
        logger.info(defaultMessage.SUCCESS)
        responseService.onSuccess(res, defaultMessage.SUCCESS, data)
      } else {
        logger.error(defaultMessage.ERROR)
        responseService.onError(res, defaultMessage.ERROR)
      }
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async getUserList (req, res) {
    try {
      logger.info('Getting user list')
      const data = await userService.getUserList()
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }
}
module.exports = UserController
