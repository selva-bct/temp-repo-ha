// external package
import { cognito } from 'config'
import AWS from 'aws-sdk'

// internal package
import { logger } from './../config/logger'
import { responseService } from './../service'
import { cognitoUserCreation, defaultStatusCode } from './../constant/constant'

class AuthController {
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

  authenticate () {

  }

  adminCreateUser (poolData) {
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

  async register (req, res, next) {
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

  changePassword () {
    console.log('change password')
  }

  validateToken () {

  }

  firstTimeChangePassword () {

  }
}

module.exports = AuthController
