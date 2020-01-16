import { defaultMessage, defaultStatusCode } from './../constant/constant'

let instance

class ResponseService {
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

  notAuthorized (res, message = defaultMessage.NOT_AUTHORIZED) {
    return res.status(defaultStatusCode.NOT_AUTHORIZED).send({
      message,
      status: defaultStatusCode.NOT_AUTHORIZED
    })
  }

  accessForbidden (res, message = defaultMessage.ACCESS_FORBIDDEN, data) {
    return res.status(defaultStatusCode.ACCESS_FORBIDDEN).send({
      message,
      data,
      status: defaultStatusCode.ACCESS_FORBIDDEN
    })
  }

  validationError (res, message = defaultMessage.VALIDATION_ERROR, data) {
    return res.status(defaultStatusCode.VALIDATION_ERROR).send({
      message,
      data,
      status: defaultStatusCode.VALIDATION_ERROR
    })
  }

  onError (res, message = defaultMessage.ERROR, error) {
    return res.status(error.status || defaultStatusCode.ERROR).send({
      message,
      status: error.status || defaultStatusCode.ERROR,
      error
    })
  }

  notFound (res, message = defaultMessage.NOT_FOUND, error) {
    return res.status(error.status || defaultStatusCode.NOT_FOUND).send({
      message,
      status: defaultStatusCode.NOT_FOUND
    })
  }

  conflict (res, message = defaultMessage.CONFLICT, error) {
    return res.status(error.status || defaultStatusCode.CONFLICT).send({
      message: error.message || message,
      status: defaultStatusCode.CONFLICT
    })
  }
}

export default new ResponseService()
