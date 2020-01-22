// external package
import { cognito } from 'config'
import AWS from 'aws-sdk'
import { promisify } from 'util'

// internal package
import { logger } from '../config/logger'
import { responseService } from '../service'
import {
  defaultStatusCode,
  defaultMessage,
  cognitoUserCreation,
  changePasswordRequest,
  resetPasswordRequest
} from '../constant/constant'

class UserController {
  constructor () {
    const arg = cognito
    AWS.config.update({
      accessKeyId: arg.accessKeyId,
      secretAccessKey: arg.secretAccessKey,
      region: arg.poolRegion
    })

    this.cognitoClient = new AWS.CognitoIdentityServiceProvider({
      apiVersion: arg.apiVersion,
      region: arg.poolRegion
    })
  }

  async authenticate (req, res) {
    try {
      logger.info('Authenticating user')
      const { username, password } = req.body
      if (!(username || password)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const params = {
        UserPoolId: cognito.userPoolId,
        AuthFlow: defaultMessage.ADMIN_NO_SRP_AUTH,
        ClientId: cognito.appClientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password
        }
      }
      const result = await promisify(this.cognitoClient.adminInitiateAuth.bind(this.cognitoClient, params))()
      logger.info(defaultMessage.SUCCESS)
      return responseService.onSuccess(res, defaultMessage.SUCCESS, result)
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
      const passwordParams = {
        Password: password,
        Permanent: true,
        Username: name,
        UserPoolId: cognito.userPoolId
      }
      const params = {
        UserPoolId: cognito.userPoolId,
        Username: name,
        ForceAliasCreation: true,
        MessageAction: 'SUPPRESS',
        DesiredDeliveryMediums: ['EMAIL'],
        TemporaryPassword: password,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          }
        ]
      }
      const userData = await promisify(this.cognitoClient.adminCreateUser.bind(this.cognitoClient, params))()
      logger.info(cognitoUserCreation.SUCCESS)
      await this.adminSetUserPassword(passwordParams)
      logger.info('Admin setting user email verified as true')
      const param = { UserPoolId: cognito.userPoolId, Username: name, UserAttributes: [{ Name: 'email_verified', Value: 'true' }] }
      await promisify(this.cognitoClient.adminUpdateUserAttributes.bind(this.cognitoClient, param))()
      logger.info('Admin setting user email verified as true was successfull')
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
      const params = {
        AccessToken: authorization,
        PreviousPassword: oldPassword,
        ProposedPassword: newPassword
      }
      const data = await promisify(this.cognitoClient.changePassword.bind(this.cognitoClient, params))()
      logger.info(changePasswordRequest.SUCCESS)
      responseService.onSuccess(res, changePasswordRequest.SUCCESS, data, defaultStatusCode.SUCCESS)
    } catch (error) {
      logger.error(error, changePasswordRequest.ERROR)
      responseService.onError(res, cognitoUserCreation.ERROR, error)
    }
  }

  async forgotPassword (req, res) {
    try {
      logger.info('Requesting for resetting the password')
      const { username } = req.body
      const { appClientId } = cognito
      const params = {
        ClientId: appClientId,
        Username: username
      }
      const data = await promisify(this.cognitoClient.forgotPassword.bind(this.cognitoClient, params))()
      logger.info(resetPasswordRequest.SUCCESS)
      return responseService.onSuccess(res, resetPasswordRequest.SUCCESS, data)
    } catch (error) {
      logger.error(error, resetPasswordRequest.ERROR)
      return responseService.onError(res, resetPasswordRequest.ERROR, error)
    }
  }

  async resetPassword (req, res) {
    try {
      logger.info('Requesting for reset of Password')
      const { username, password, confirmationCode } = req.body
      const { appClientId } = cognito
      const params = {
        Username: username,
        Password: password,
        ConfirmationCode: confirmationCode,
        ClientId: appClientId
      }
      const data = await promisify(this.cognitoClient.confirmForgotPassword.bind(this.cognitoClient, params))()
      logger.info(changePasswordRequest.SUCCESS)
      responseService.onSuccess(res, changePasswordRequest.SUCCESS, data, defaultStatusCode.SUCCESS)
    } catch (error) {
      logger.error(error, changePasswordRequest.ERROR)
      responseService.onError(res, cognitoUserCreation.ERROR, error)
    }
  }

  adminSetUserPassword (userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info('Admin set password for user')
        const response = await promisify(this.cognitoClient.adminSetUserPassword.bind(this.cognitoClient, userInfo))()
        logger.info(logger.info('Admin setting user password was successful'))
        resolve(response)
      } catch (error) {
        logger.error(error, resetPasswordRequest.ERROR)
        reject(error)
      }
    })
  }

  async validateToken (req, res, next) {
    try {
      logger.info('Into verifying user...')
      const { authorization } = req.headers
      const params = {
        authorization
      }
      const user = await promisify(this.cognitoClient.getUser.bind(this.cognitoClient, params))()
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
}
module.exports = UserController
