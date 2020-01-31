import crypto from 'crypto'
import { secret, host, port } from 'config'

// internal package
import { logger } from '../config/logger'
import {
  ResponseService,
  UserService,
  CognitoService,
  RoleService,
  AddressService,
  EmailService
} from '../service'
import {
  defaultStatusCode,
  defaultMessage,
  cognitoUserCreation
} from '../constant/constant'

class UserController {
  constructor () {
    this.addressService = new AddressService()
    this.cognitoService = new CognitoService()
    this.roleService = new RoleService()
    this.userService = new UserService()
    this.responseService = new ResponseService()
    this.emailService = new EmailService()
  }

  async authenticate (req, res) {
    const { email, password } = req.body
    try {
      logger.info('Authenticating user')

      if (!(email && password)) {
        return this.responseService.validationError(res, new Error(defaultMessage.VALIDATION_ERROR))
      }
      const data = await this.cognitoService.login(email, password)
      await this.cognitoService.resetFailAttempts(email)
      logger.info('user authenticated successfully')
      return this.responseService.onSuccess(res, 'user authenticated successfully', data)
    } catch (error) {
      logger.error(error, defaultMessage.NOT_AUTHORIZED)
      await this.cognitoService.updateFailAttempts(email)
      if (error.code === defaultMessage.NOT_AUTHORIZED_EXCEPTION) {
        return this.responseService.notAuthorized(res, error)
      }
      return this.responseService.onError(res, error)
    }
  }

  async register (req, res, next) {
    try {
      logger.info('User registration')
      const { body: { email, password } } = req
      if (!(email && password)) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      await this.cognitoService.createUser(email, password)
      const updatedUser = await this.userService.updateUser({
        email,
        userStatus: 'registered',
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
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      if (password !== confirmPassword) {
        return this.responseService.validationError(res, new Error('PASSWORD_DO_NOT_MATCH'))
      }
      await this.cognitoService.changePassword(oldPassword, password, authorization)
      logger.info('Change Password Request was successful')
      this.responseService.onSuccess(res, 'Change Password Request was successful')
    } catch (error) {
      logger.error(error, 'Error while changing password')
      this.responseService.onError(res, error)
    }
  }

  async forgotPassword (req, res) {
    try {
      logger.info('Requesting for resetting the password')
      const { email } = req.body
      if (!email) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      await this.cognitoService.forgotPassword(email)
      logger.info('Check your email to reset the password')
      return this.responseService.onSuccess(res, 'Check your email to reset the password')
    } catch (error) {
      logger.error(error, 'Error while request for forgot password')
      return this.responseService.onError(res, error, 'Error while request for forgot password')
    }
  }

  async resetPassword (req, res) {
    try {
      logger.info('Requesting for reset of Password')
      const { email, password, confirmationCode } = req.body
      if (!(email && password && confirmationCode)) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
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
      logger.info('Into verifying user')
      const { authorization } = req.headers
      if (!(authorization)) {
        return this.responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const user = await this.cognitoService.validateToken(authorization)
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
      const { id } = req.params
      const data = await this.userService.getUserById(id)
      logger.info('Successfully fetch user data')
      this.responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, 'Error while fetching user data')
      this.responseService.onError(res, error)
    }
  }

  async updateUser (req, res) {
    try {
      logger.info('Updating user data')
      const user = req.body
      const id = req.params
      if (!(user)) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const userInfo = await this.userService.getUserById(id)
      if (!userInfo) {
        logger.error(defaultMessage.NOT_FOUND)
        return this.responseService.NOT_FOUND(res, defaultMessage.NOT_FOUND)
      }
      const data = await this.userService.updateUser(user)
      logger.info('Successfully updated user data')
      this.responseService.onSuccess(res, 'Successfully updated user data', data)
    } catch (error) {
      logger.error(error, 'Error while updating user data')
      this.responseService.onError(res, error)
    }
  }

  async getUserList (req, res) {
    try {
      logger.info('Getting user list')
      const data = await this.userService.getUserList()
      logger.info('Successfully fetch user list')
      this.responseService.onSuccess(res, 'Successfully fetch user list', data)
    } catch (error) {
      logger.error(error, 'Error while fetching user list')
      this.responseService.onError(res, error)
    }
  }

  async inviteUser (req, res) {
    try {
      logger.info('Into invite user')
      const { body } = req
      const hash = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(body))
        .digest('hex')
      // Todo:: validate the req body
      let user = body
      if (!(user)) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      user = {
        ...user,
        tokenValue: hash,
        userStatus: 'invited'
      }
      // save the address
      // assign the newly created address to the user
      const newAddress = await this.addressService.createAddress(body)
      // read the role type for frontend and validate via enum
      // Todo :: Bring this role id from frontend
      const role = await this.roleService.getRole(1)

      const userInfo = await this.getUserByEmail(user.email)
      if (userInfo) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.USER_ALREADY_EXIST))
      }

      // Todo: Assign address nick name based on the role assigned
      const newUser = await this.userService.createUser(user)
      console.log('Email Invite link  ::: ', `http://localhost:3000/auth/signup/${hash}`)
      await newUser.setRoles(role)
      await newUser.setAddresses(newAddress)
      this.emailService.sendMail({
        to: [newUser.email],
        subject: 'GEP Invite',
        message: `http://${host}:${port}/auth/signup/${hash}`
      })
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
      let error
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
      logger.error('Error while fetching user by invite token ', error)
      this.responseService.onError(res, error)
    }
  }
}

module.exports = UserController
