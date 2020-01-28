import { defaultMessage, defaultStatusCode } from './../constant/constant'

let instance

export class ResponseService {
  constructor (value) {
    if (instance) {
      return instance
    }
    instance = this
  }

  onSuccess (res, message, data, statusCode) {
    return res.json({
      status: statusCode || defaultStatusCode.SUCCESS,
      message,
      data
    })
  }

  notAuthorized (res, error, message = defaultMessage.NOT_AUTHORIZED) {
    return res.status(defaultStatusCode.NOT_AUTHORIZED).send({
      message: error.message || message
    })
  }

  accessForbidden (res, error, message = defaultMessage.ACCESS_FORBIDDEN) {
    return res.status(defaultStatusCode.ACCESS_FORBIDDEN).send({
      message: error.message || message
    })
  }

  validationError (res, error, data, message = defaultMessage.VALIDATION_ERROR) {
    return res.status(defaultStatusCode.VALIDATION_ERROR).send({
      message: error.message || message,
      data
    })
  }

  onError (res, error, message = defaultMessage.ERROR) {
    return res.status(error.statusCode || defaultStatusCode.ERROR).send({
      message: error.message || message
    })
  }

  notFound (res, error, message = defaultMessage.NOT_FOUND) {
    return res.status(error.statusCode || defaultStatusCode.NOT_FOUND).send({
      message: error.message || message
    })
  }

  conflict (res, error, message = defaultMessage.CONFLICT) {
    return res.status(error.statusCode || defaultStatusCode.CONFLICT).send({
      message: error.message || message
    })
  }
}

export default ResponseService
