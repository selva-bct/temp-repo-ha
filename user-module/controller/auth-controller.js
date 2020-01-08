// external package
import { cognito } from 'config'
import AWS from 'aws-sdk'

// internal package
import { logger } from './../config/logger'
import { responseService } from './../service'
import { cognitoUserCreation, defaultStatusCode, defaultMessage, changePassword } from './../utils/constant'

class AuthController {
  constructor() {
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

  authenticate() {

  }

  adminCreateUser(poolData) {
    return new Promise((resolve, reject) => {
      logger.info('Calling cognito api for creating user')
      this.cognitoClient.adminCreateUser(poolData, (error, data) => {
        if (error) {
          return reject(error)
        }
        resolve(data)
      })
    })
  }

  async register(req, res, next) {
    try {
      logger.info('Into User registration')
      const { body: { name, email, password, phone } } = req
      const poolData = {
        UserPoolId: cognito.userPoolId,
        Username: name,
        DesiredDeliveryMediums: ['EMAIL'],
        TemporaryPassword: password,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          },
          {
            Name: 'phone_number',
            Value: phone
          }
        ]
      }
      const userData = await this.adminCreateUser(poolData)
      logger.info(cognitoUserCreation.SUCCESS)
      responseService.onSuccess(res, cognitoUserCreation.SUCCESS, userData, defaultStatusCode.RESOURCE_CREATED)
    } catch (error) {
      logger.error(error, cognitoUserCreation.ERROR)
      if (error.code === 'UsernameExistsException') {
        responseService.conflict(res, cognitoUserCreation.CONFLICT, error)
      } else {
        responseService.onError(res, cognitoUserCreation.ERROR, error)
      }
    }
  }

  async changePassword(req, res) {
    try {
      console.log('change password')
      const { password, newPassword } = req.body
      const { authorization } = req.headers
      const options = {
        AccessToken: authorization,
        PreviousPassword: password,
        ProposedPassword: newPassword
      }
      const result = await new Promise((resolve, reject) => {
        this.cognitoClient.changePassword(options, function (err, data) {
          if (err) return reject(err)
          resolve(data)
        })
      })
      logger.info(changePassword.SUCCESS)
      return responseService.onSuccess(res, changePassword.SUCCESS)

    } catch (error) {
      logger.error(error, changePassword.ERROR)
      return responseService.onError(res, changePassword.ERROR, error)
    }
  }

  validateToken() {

  }

  firstTimeChangePassword() {

  }
}

module.exports = AuthController
