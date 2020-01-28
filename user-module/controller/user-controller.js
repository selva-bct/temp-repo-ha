import crypto from 'crypto'
import { pick } from 'lodash'
import { secret } from 'config'

// internal package
import { logger } from '../config/logger'
import { 
  ResponseService,
  UserService,
  CognitoService,
  RoleService,
  AddressService
} from '../service'
import {
  defaultStatusCode,
  defaultMessage,
  cognitoUserCreation,
  changePasswordRequest,
  resetPasswordRequest
} from '../constant/constant'

class UserController {
  constructor() {
    this.addressService = new AddressService()
    this.cognitoService = new CognitoService()
    this.roleService = new RoleService()
    this.userService = new UserService()
    this.responseService = new ResponseService()
  }
  async authenticate (req, res) {
    const { username, password } = req.body
    try {
      logger.info('Authenticating user')
      
      if (!(username && password)) {
        return this.responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const data = await this.cognitoService.login(username, password)
      await this.cognitoService.resetFailAttempts(username)
      logger.info(defaultMessage.SUCCESS)
      return this.responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.NOT_AUTHORIZED)
      await this.cognitoService.updateFailAttempts(username)
      if (error.code === defaultMessage.NOT_AUTHORIZED_EXCEPTION) {
        return this.responseService.notAuthorized(res, error)
      }
      return this.responseService.onError(res, error)
    }
  }

  async register (req, res, next) {
    try {
      logger.info('User registration')
      const { body: { name, email, password } } = req
      if (!(name && email && password)) {
        const error = new Error('MANDATORY_FIELDS_MISSING')
        return this.responseService.validationError(res, error)
      }
      const userData = await this.cognitoService.createUser(name, email, password)
      const updatedUser = await this.userService.updateUser({
        email,
        status: 'registered',
        registeredAt: new Date()
      })
      this.responseService.onSuccess(res, cognitoUserCreation.SUCCESS, updatedUser, defaultStatusCode.RESOURCE_CREATED)
    } catch (error) {
      logger.error(error, cognitoUserCreation.ERROR)
      if (error.code === defaultMessage.USERNAME_EXIST_EXCEPTION) {
        this.responseService.conflict(res, error)
      } else {
        this.responseService.onError(res, error)
      }
    }
  }

  async changePassword (req, res) {
    try {
      logger.info('Requesting for change of Password')
      const { oldPassword, password, confirmPassword } = req.body
      const { authorization } = req.headers
      if (!(oldPassword && password && authorization)) {
        const error =  new Error('MANDATORY_FIELDS_MISSING')
        return this.responseService.validationError(res, error)
      }

      if (password !== confirmPassword) {
        const error =  new Error('PASSWORD_DO_NOT_MATCH')
        return this.responseService.validationError(res, error)
      }

      await this.cognitoService.changePassword(oldPassword, password, authorization)
      logger.info(changePasswordRequest.SUCCESS)
      this.responseService.onSuccess(res, changePasswordRequest.SUCCESS)
    } catch (error) {
      logger.error(error, changePasswordRequest.ERROR)
      this.responseService.onError(res, error)
    }
  }

  async forgotPassword (req, res) {
    try {
      logger.info('Requesting for resetting the password')
      const { email } = req.body
      if (!email) {
        const error = new Error("PROVIDE_EMAIL")
        return this.responseService.validationError(res, error, {
          message: [
            'Please provide email'
          ]
        })
      }
      await this.cognitoService.forgotPassword(email)
      logger.info(forgotPasswordRequest.SUCCESS)
      return this.responseService.onSuccess(res, forgotPasswordRequest.SUCCESS)
    } catch (error) {
      logger.error(error, forgotPasswordRequest.ERROR)
      return this.responseService.onError(res, error, forgotPasswordRequest.ERROR)
    }
  }

  async resetPassword (req, res) {
    try {
      logger.info('Requesting for reset of Password')
      const { email, password, confirmationCode } = req.body
      if (!(email && password && confirmationCode)) {
        const error = new Error('MANDATORY_FIELDS_MISSING')
        return this.responseService.validationError(res, error, {
          message: [
            'Please provide mandatory fields like email, password and confirmation code'
          ]
        })
      }
      await this.cognitoService.resetPassword(email, password, confirmationCode)
      logger.info('Password resert was successfull')
      this.responseService.onSuccess(res, 'Password resert was successfull')
    } catch (error) {
      logger.error(error, 'Error while resetting password')
      this.responseService.onError(res, error, 'Error while resetting password')
    }
  }

  async validateToken (req, res, next) {
    try {
      logger.info('Into verifying user...')
      const { authorization } = req.headers
      if (!(authorization)) {
        return this.responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const user = await cognitoService.validateToken(authorization)
      if (!user) {
        const error = new Error(defaultMessage.NOT_AUTHORIZED)
        logger.error(error, defaultMessage.NOT_AUTHORIZED)
        this.responseService.NOT_AUTHORIZED(res, defaultMessage.NOT_AUTHORIZED, defaultStatusCode.NOT_AUTHORIZED)
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
        return this.responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const data = await this.userService.getUser(username)
      logger.info(defaultMessage.SUCCESS)
      this.responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      this.responseService.onError(res, error)
    }
  }

  async updateUser (req, res) {
    try {
      logger.info('Updating user')
      const user = req.body
      if (!(user)) {
        return this.responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const userInfo = await this.userService.getUser(user.username)
      if (userInfo) {
        const data = await this.userService.updateUser(user)
        logger.info(defaultMessage.SUCCESS)
        this.responseService.onSuccess(res, defaultMessage.SUCCESS, data)
      } else {
        logger.error(defaultMessage.ERROR)
        this.responseService.onError(res, defaultMessage.ERROR)
      }
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      this.responseService.onError(res, error)
    }
  }

  async getUserList (req, res) {
    try {
      logger.info('Getting user list')
      const data = await this.userService.getUserList()
      logger.info(defaultMessage.SUCCESS)
      this.responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      this.responseService.onError(res, error)
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
        invitedAt: new Date(),
        inviteToken: hash,
        status: 'invited'
      }
      // save the address
      // assign the newly created address to the user
      const newAddress = await this.addressService.createAddress(body)
      // read the role type for frontend and validate via enum
      const role = await this.roleService.getRoleByRoleName('Patient')
      // Todo: Assign address nick name based on the role assigned
      const newUser = await this.userService.createUser(user)
      console.log('Email Invite link  ::: ', `http://localhost:3000/auth/signup/${hash}`)
      await newUser.setRoles(role)
      await newUser.setAddresses(newAddress)
      // Todo:: need to send email
      logger.info('sucessfully created the user')
      this.responseService.onSuccess(res, 'user invited successfully')
    } catch (error) {
      logger.info('error creating the user', error)
      this.responseService.onError(res, error)
    }
  }
  
  async getUserByToken (req, res) {
    try {
      const { inviteToken } = req.params
      // checking if the token received belongs to a valid user
      const user = await this.userService.getUserByInviteToken(inviteToken)
      let error;
      if (!user) {  
        error = new Error('INVALID_TOKEN')
      }
      // TODO: please add a check for the invite token expiry
      // checking if the validation above was cleared
      if (error) {
        return this.responseService.validationError(res, error)
      }
      logger.info('Successfully fetched user detail by invite token')
      this.responseService.onSuccess(res, null, user)
    } catch (error) {
      logger.error('Error while fetching user by invite token ',error)
      this.responseService.onError(res, error)
    }
  }
}

module.exports = UserController
