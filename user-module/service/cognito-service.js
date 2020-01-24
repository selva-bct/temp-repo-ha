// external package
import { cognito } from 'config'
import AWS from 'aws-sdk'
import { promisify } from 'util'

import { logger } from '../config/logger'
import { userService } from '../service'

class CognitoService {
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

  async login (username, password) {
    try {
      logger.info('login user')
      const params = {
        UserPoolId: cognito.userPoolId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        ClientId: cognito.appClientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password
        }
      }
      return await promisify(this.cognitoClient.adminInitiateAuth.bind(this.cognitoClient, params))()
    } catch (error) {
      logger.error('Error while login user')
      this.updateFailAttempts(username)
      throw error
    }
  }

  async updateFailAttempts (username) {
    try {
      logger.info('update login failed attempts')
      const userAttempts = await userService.getUser(username)
      if (userAttempts !== null) {
        const data = {
          username: username,
          loginAttempts: userAttempts.loginAttempts + 1
        }
        userService.updateUser(data)
      }
    } catch (error) {
      logger.error('Error while updating login Failed Attempts')
      throw error
    }
  }

  async resetFailAttempts (username) {
    try {
      logger.info('Reset login failed attempts')
      const userAttempts = await userService.getUser(username)
      if (userAttempts !== null) {
        const data = {
          username: username,
          loginAttempts: 0
        }
        userService.updateUser(data)
      }
    } catch (error) {
      logger.error('Error while reseting login Failed Attempts')
      throw error
    }
  }

  async forgotPassword (username) {
    try {
      logger.info('Requesting for resetting the password')
      const { appClientId } = cognito
      const params = {
        ClientId: appClientId,
        Username: username
      }
      return await promisify(this.cognitoClient.forgotPassword.bind(this.cognitoClient, params))()
    } catch (error) {
      logger.error('Error while request for forgot password')
      throw error
    }
  }

  async resetPassword (username, password, confirmationCode) {
    try {
      const { appClientId } = cognito
      const params = {
        Username: username,
        Password: password,
        ConfirmationCode: confirmationCode,
        ClientId: appClientId
      }
      return await promisify(this.cognitoClient.confirmForgotPassword.bind(this.cognitoClient, params))()
    } catch (error) {
      logger.error('Error while changing password')
      throw error
    }
  }
}

export default new CognitoService()
