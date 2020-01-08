import { defaultMessage, defaultStatusCode } from './../utils/constant'

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
    return res.json({
      message,
      status: defaultStatusCode.NOT_AUTHORIZED
    })
  }

  accessForbidden (res, message = defaultMessage.ACCESS_FORBIDDEN, data) {
    return res.json({
      message,
      data,
      status: defaultStatusCode.ACCESS_FORBIDDEN
    })
  }

  validationError (res, message = defaultMessage.VALIDATION_ERROR, data) {
    return res.json({
      message,
      data,
      status: defaultStatusCode.VALIDATION_ERROR
    })
  }

  onError (res, message = defaultMessage.ERROR, error) {
    return res.json({
      message,
      status: error.status || defaultStatusCode.ERROR
    })
  }

  notFound (res, message = defaultMessage.NOT_FOUND, error) {
    return res.json({
      message,
      status: defaultStatusCode.NOT_FOUND
    })
  }

  conflict (res, message = defaultMessage.CONFLICT, error) {
    return res.json({
      message: error.message || message,
      status: defaultStatusCode.CONFLICT
    })
  }
}

export default new ResponseService()
