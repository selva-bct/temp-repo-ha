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

  async createUser (email, password) {
    try {
      logger.info('Creating user')
      const passwordParams = {
        Password: password,
        Permanent: true,
        Username: email,
        UserPoolId: cognito.userPoolId
      }
      const params = {
        UserPoolId: cognito.userPoolId,
        Username: email,
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
      const param = { UserPoolId: cognito.userPoolId, Username: email, UserAttributes: [{ Name: 'email_verified', Value: 'true' }] }
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

  async login (email, password) {
    try {
      logger.info('login user')
      const params = {
        UserPoolId: cognito.userPoolId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        ClientId: cognito.appClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      }
      return await promisify(this.cognitoClient.adminInitiateAuth.bind(this.cognitoClient, params))()
    } catch (error) {
      logger.error('Error while login user')
      throw error
    }
  }

  async updateFailAttempts (email) {
    try {
      logger.info('update login failed attempts')
      const user = await this.userService.getUser(email)
      if (user) {
        /*  if (user.loginAttempts > 5) {
          const params = {
            UserPoolId: cognito.userPoolId,
            Username: email
          }
          await promisify(this.cognitoClient.adminDisableUser.bind(this.cognitoClient, params))()
          throw new Error('Account has locked')
        } */
        const data = {
          email,
          loginAttempts: user.loginAttempts + 1,
          lastLoginAt: new Date()
        }
        await this.userService.updateUser(data)
      }
    } catch (error) {
      logger.error('Error while updating login Failed Attempts')
      throw error
    }
  }

  async resetFailAttempts (email) {
    try {
      logger.info('Reset login failed attempts')
      const user = await this.userService.getUser(email)
      if (user) {
        const data = {
          email,
          loginAttempts: 0,
          lastLoginAt: new Date()
        }
        await this.userService.updateUser(data)
      }
    } catch (error) {
      logger.error('Error while reseting login Failed Attempts')
      throw error
    }
  }

  async forgotPassword (email) {
    try {
      logger.info('Requesting for resetting the password')
      const { appClientId } = cognito
      const params = {
        ClientId: appClientId,
        Username: email
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

  changePassword (oldPassword, password, authorization) {
    return new Promise(async (resolve, reject) => {
      try {
        logger.info('Requesting for change of Password')
        const params = {
          AccessToken: authorization,
          PreviousPassword: oldPassword,
          ProposedPassword: password
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
