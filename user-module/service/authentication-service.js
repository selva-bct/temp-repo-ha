import jwtDecode from 'jwt-decode'
import { logger } from '../config/logger'
import { ResponseService } from './response-service'
import { CognitoService } from './cognito-service'
import { defaultMessage, defaultStatusCode } from './../constant/constant'
import { CryptoService } from './crypto-service'

const responseService = new ResponseService()
const cognitoService = new CognitoService()
const cryptoService = new CryptoService()

export async function validateToken (req, res, next) {
  try {
    logger.info('Into verifying user')
    const { authorization } = req.headers
    if (!(authorization)) {
      return responseService.notAuthorized(res, new Error(defaultMessage.NOT_AUTHORIZED))
    }
    const decodedUser = await decodeToken(authorization)
    const user = await cognitoService.validateToken(decodedUser.raw.accessToken)
    if (!user) {
      const error = new Error(defaultMessage.NOT_AUTHORIZED)
      logger.error(error, defaultMessage.NOT_AUTHORIZED)
      responseService.NOT_AUTHORIZED(res, defaultMessage.NOT_AUTHORIZED, defaultStatusCode.NOT_AUTHORIZED)
    }
    logger.info('Successfully verified user')

    req.user = decodedUser
    req.userId = decodedUser.raw.userId
    next()
  } catch (error) {
    logger.error(error, defaultMessage.TOKEN_VALIDATION_ERROR)
    responseService.notAuthorized(res, new Error(defaultMessage.NOT_AUTHORIZED))
  }
}

async function decodeToken (token) {
  try {
    const response = {}
    response.raw = cryptoService.decrypt(token)
    response.decoded = jwtDecode(response.raw.accessToken)
    return response
  } catch (error) {
    logger.error('Error while decoding token :: ', error)
    throw error
  }
}
