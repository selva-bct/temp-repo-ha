export const defaultStatusCode = {
  NOT_AUTHORIZED: 401,
  ERROR: 500,
  SUCCESS: 200,
  ACCESS_FORBIDDEN: 403,
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RESOURCE_CREATED: 201
}

export const defaultMessage = {
  NOT_AUTHORIZED: 'User not authorized',
  ERROR: 'Oops uncaught exception',
  SUCCESS: 'Service request was successful',
  ACCESS_FORBIDDEN: 'Not authorized to view this particular content',
  VALIDATION_ERROR: 'Error Validating data',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exist'
}

export const cognitoUserCreation = {
  SUCCESS: 'Successfully created user in cognito...',
  ERROR: 'Failed to create user in cognito'
}

export const cognitoUserAuthentication = {
  SUCCESS: 'Successfully logged in',
  ERROR: {
    EMAIL: 'Email not found',
    USERNAME: 'Username not found',
    PASSWORD: 'Wrong password'
  }
}

// module.exports = {
//   defaultMessage,
//   defaultStatusCode,
//   cognitoUserCreation,
//   cognitoUserAuthentication
// }
