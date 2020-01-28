// external package
import { cognito } from 'config'
import AWS from 'aws-sdk'
import { promisify } from 'util'

import { logger } from '../config/logger'
import { UserService } from '../service'
import {
  cognitoUserCreation,
  resetPasswordRequest
} from '../constant/constant'

export class CognitoService {
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
    this.userService = new UserService()
  }

  async createUser (name, email, password) {
    try {
      logger.info('Creating user')
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
      this.adminSetUserPassword(passwordParams)
      logger.info('Admin setting user email verified as true')
      const param = { UserPoolId: cognito.userPoolId, Username: name, UserAttributes: [{ Name: 'email_verified', Value: 'true' }] }
      await promisify(this.cognitoClient.adminUpdateUserAttributes.bind(this.cognitoClient, param))()
      logger.info('Admin setting user email verified as true was successfull')
      return userData
    } catch (error) {
      logger.error('Error while creating user')
      throw error
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
      throw error
    }
  }

  updateFailAttempts (email) {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info('update login failed attempts')
        let updatedUser
        const user = await this.userService.getUser(email)
        if (user) {
          const data = {
            email: email,
            id: user.id,
            loginAttempts: user.loginAttempts + 1
          }
          updatedUser = await this.userService.updateUser(data)
        }
        resolve(updatedUser)
      } catch (error) {
        logger.error('Error while updating login Failed Attempts')
        reject(error)
      }
    })
  }

  resetFailAttempts (email) {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info('Reset login failed attempts')
        let updatedUser
        const user = await this.userService.getUser(email)
        if (user) {
          const data = {
            email,
            id: user.id,
            loginAttempts: 0
          }
          updatedUser = await this.userService.updateUser(data)
        }
        resolve(updatedUser)
      } catch (error) {
        logger.error('Error while reseting login Failed Attempts')
        reject(error)
      }
    })
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

  changePassword (oldPassword, newPassword, authorization) {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info('Requesting for change of Password')
  
        const params = {
          AccessToken: authorization,
          PreviousPassword: oldPassword,
          ProposedPassword: newPassword
        }
        const response = await promisify(this.cognitoClient.changePassword.bind(this.cognitoClient, params))()
        resolve(response)
      } catch (error) {
        logger.error('Error while changing password')
        reject(error)
      }
    })
  }

  async validateToken (authorization) {
    try {
      const params = {
        authorization: authorization
      }
      return await promisify(this.cognitoClient.getUser.bind(this.cognitoClient, params))()
    } catch (error) {
      logger.error('Error while validateToken')
      throw error
    }
  }
}
