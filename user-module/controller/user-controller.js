// external package
import { cognito, signature } from 'config'
import AWS from 'aws-sdk'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

// internal package
import { logger } from '../config/logger'
import { responseService } from '../service'
import { 
  defaultStatusCode,
  defaultMessage,
  cognitoUserCreation,
  changePasswordRequest,
  forgotPasswordRequest
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
      logger.info('Authenticating user ... ')
      const { username, password } = req.body
      if (!(username || password)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const params = {
        UserPoolId: cognito.userPoolId,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
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
      if (error.name === "NotAuthorizedException") {
        return responseService.notAuthorized(res, defaultMessage.NOT_AUTHORIZED, error)
      } else {
        return responseService.onError(res, defaultMessage.ERROR, error)
      }
    }
  }

  async register (req, res, next) {
    try {
      logger.info('Into User registration')
      const { body: { name, email, password } } = req
      const params = {
        UserPoolId: cognito.userPoolId,
        Username: name,
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

  async changePassword (req, res) {
    try {
      logger.info('Requesting for change of Password...')
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
      logger.info(error, changePasswordRequest.ERROR)
      responseService.onError(res, cognitoUserCreation.ERROR, error)
    }
  }

  async forgotPassword(req, res) {
    try {
      logger.info('Requesting for a forgot password...')
      const { username } = req.body
      const { appClientId } = cognito
      const params = {
        ClientId: appClientId,
        Username: username
      }
      const data = await promisify(this.cognitoClient.forgotPassword.bind(this.cognitoClient, params))()
      logger.info(forgotPasswordRequest.SUCCESS)
      return responseService.onSuccess(res, forgotPasswordRequest.SUCCESS, data)
    } catch (error) {
      logger.error(error, forgotPasswordRequest.ERROR, data)
      return responseService.onError(res, forgotPasswordRequest.ERROR, error)
    }
  }

  async firstTimeChangePassword (req, res) {
    try {
      const { session, password, username } = req.body
      const { userPoolId, appClientId } = cognito
      const params = {
        UserPoolId: userPoolId,
        ClientId: appClientId,
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        ChallengeResponses: {
          USERNAME: username,
          NEW_PASSWORD: password
        },
        Session: session
      }
      const response = await promisify(this.cognitoClient.adminRespondToAuthChallenge.bind(this.cognitoClient, params))()
      logger.info('Password was Successfully changes...')
      responseService.onSuccess(res, 'Success', response)
    } catch (error) {
      logger.error(error, 'Error while changing password first time')
      responseService.onError(res, 'Error while changing password first time', error)
    }
  }

  inviteUser (req, res) {
    const reqUser = req.body // deep clone
    // validate data
    validateUser(reqUser)
    // construct the jwt token, user object
    const token = jwt.sign(reqUser, signature, { algorithm: 'RS256', expiresIn: '1 days' });
    // create user object and save it
    // send email invitation to user
    // respond back to the admin

  }

  // move this method to some other util file for reusabilty across different entities
  getUser(AccessToken) {
    return promisify(this.cognitoClient.getUser.bind(this.cognitoClient, params))()
  }

  async validateToken () {
    try {
      logger.info('Into verifying user...')
      const { authorization } = req.headers
      const user = await this.getUser(authorization)
      if (!user) {
        const error = new Error(defaultMessage.NOT_AUTHORIZED)
        logger.error(error, defaultMessage.NOT_AUTHORIZED)
        responseService.NOT_AUTHORIZED(res, defaultMessage.NOT_AUTHORIZED, defaultStatusCode.NOT_AUTHORIZED)
      }
      logger.info('Successfully verified user...')
      responseService.onSuccess(res, defaultMessage.SUCCESS, user, defaultStatusCode.SUCCESS)
    } catch (error) {
      logger.error(error, 'Error while validating token')
      responseService.onError(res, 'Error while validating token', error)
    }
  }
}
module.exports = UserController
