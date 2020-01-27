// external package
import { cognito } from 'config'
import AWS from 'aws-sdk'
import { promisify } from 'util'
import crypto from 'crypto'
import { pick } from 'lodash';
const secret = 'abcdefg';

// internal package
import { logger } from '../config/logger'
import { responseService, userService, roleService, addressService } from '../service'
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
        return responseService.notAuthorized(res, error.message, error)
      } else {
        return responseService.onError(res, error.message, error)
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
      const { email } = req.body
      if (!email) {
        return responseService.validationError(res, defaultMessage.validationError, {
          message: 'Please enter email'
        })
      }
      const { appClientId } = cognito
      const params = {
        ClientId: appClientId,
        Username: email
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
      const { email, password, confirmationCode } = req.body
      const { appClientId } = cognito
      const params = {
        Username: email,
        Password: password,
        ConfirmationCode: confirmationCode,
        ClientId: appClientId
      }
      const data = await promisify(this.cognitoClient.confirmForgotPassword.bind(this.cognitoClient, params))()
      logger.info(changePasswordRequest.SUCCESS)
      responseService.onSuccess(res, changePasswordRequest.SUCCESS, data, defaultStatusCode.SUCCESS)
    } catch (error) {
      logger.error(error, changePasswordRequest.ERROR)
      if (error.name === 'ExpiredCodeException') {
        responseService.onError(res, error.message, error)  
      } else {
        responseService.onError(res, cognitoUserCreation.ERROR, error)
      }
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

  async getUser (req, res) {
    try {
      logger.info('Getting user by Email')
      const { username } = req.body
      const data = await userService.getUser(username)
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS, data, defaultStatusCode.SUCCESS)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async updateUser (req, res) {
    try {
      logger.info('Updating user')
      const user = req.body
      const userInfo = await userService.getUser(user.username)
      if (userInfo !== null) {
        const data = await userService.updateUser(user)
        logger.info(defaultMessage.SUCCESS)
        responseService.onSuccess(res, defaultMessage.SUCCESS, data, defaultStatusCode.SUCCESS)
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
      responseService.onSuccess(res, defaultMessage.SUCCESS, data, defaultStatusCode.SUCCESS)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async addRole (req, res) {
    try {
      logger.info('Adding new role')
      if (req.body.role !== null && req.body.role !== '') {
        const data = await userService.addRole(req.body)
        logger.info(defaultMessage.SUCCESS)
        responseService.onSuccess(res, defaultMessage.SUCCESS, data, defaultStatusCode.SUCCESS)
      } else {
        logger.error(defaultMessage.ERROR)
        responseService.onError(res, defaultMessage.ERROR)
      }
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async updateRole (req, res) {
    try {
      logger.info('Updating role')
      const role = req.body
      const roleInfo = await userService.getRole(role.roleId)
      if (roleInfo !== null) {
        await userService.updateRole(role)
        logger.info(defaultMessage.SUCCESS)
        responseService.onSuccess(res, defaultMessage.SUCCESS, defaultStatusCode.SUCCESS)
      } else {
        logger.error(defaultMessage.NOT_FOUND)
        responseService.onError(res, defaultMessage.NOT_FOUND)
      }
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async getRole (req, res) {
    try {
      logger.info('Getting role by Id')
      const { id } = req.params
      const data = await userService.getRole(id)
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS, data, defaultStatusCode.SUCCESS)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async getRoleList (req, res) {
    try {
      logger.info('Getting user list')
      const data = await userService.getRoleList()
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS, data, defaultStatusCode.SUCCESS)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async deleteRole (req, res) {
    try {
      logger.info('Delete role')
      const { id } = req.params
      const role = await userService.getRole(id)
      if (role !== null) {
        const data = await userService.deleteRole(id)
        logger.info(defaultMessage.SUCCESS)
        responseService.onSuccess(res, defaultMessage.SUCCESS, data, defaultStatusCode.SUCCESS)
      } else {
        logger.error(defaultMessage.NOT_FOUND)
        responseService.onError(res, defaultMessage.NOT_FOUND)
      }
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }


  async inviteUser( req, res) {
    try {
      logger.info('Into invite user')
      const { body } = req
      const hash = crypto.createHmac('sha256', secret)
                   .update(JSON.stringify(body))
                   .digest('hex');
      // Todo:: validate the req body
      let user = body
      user = {
        ...user,
        inviteToken: hash,
        status: 'invited'
      }
      // save the address
      // assign the newly created address to the user
      const newAddress = await addressService.createAddress(body)
      const role = await userService.getRoleByRoleName('Patient')
      const newUser = await userService.createUser(user)
      console.log('Email Invite link  ::: ', hash)
      await newUser.setRoles(role)
      await newUser.setAddresses(newAddress)
      logger.info('sucessfully created the user')
      responseService.onSuccess(res, 'user invited successfully')
    } catch (error) {
      logger.info('error creating the user', error)
      responseService.onError(res, error.message, error)
    }
  }


  async getUserByToken (req, res) {
    try {
      const { inviteToken } = req.params
      // checking if the token received belongs to a valid user
      const user = await userService.getUserByInviteToken(inviteToken)
      let error;
      if (!user) {  
        error = new Error('INVALID_TOKEN')
      } else if (user.status !== 'invited') {
        error = new Error('USER_ALREADY_REGITERED')
      }
      // TODO: please add a check for the invite token expiry
      // checking if the validation above was cleared
      if (error) {
        return responseService.validationError(res, error.message, error)
      }
      logger.info('Successfully fetched user detail by invite token')
      responseService.onSuccess(res, null, user)
    } catch (error) {
      logger.error('Error while fetching user by invite token ',error)
      responseService.onError(res, error.message, error)
    }
  }
}
module.exports = UserController
