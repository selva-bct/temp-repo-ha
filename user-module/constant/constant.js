export const defaultStatusCode = {
  NOT_AUTHORIZED: 401,
  SUCCESS: 200,
  ERROR: 500,
  NO_CONTENT: 204,
  ACCESS_FORBIDDEN: 403,
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RESOURCE_CREATED: 201
}

export const defaultMessage = {
  NOT_AUTHORIZED: 'User not authorized',
  ERROR: 'Oops something went wrong',
  SUCCESS: 'Service request was successful',
  ACCESS_FORBIDDEN: 'Not authorized to view this particular content',
  VALIDATION_ERROR: 'Error validating data',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource already exist',
  ADMIN_NO_SRP_AUTH: 'ADMIN_NO_SRP_AUTH',
  NOT_AUTHORIZED_EXCEPTION: 'NotAuthorizedException',
  USERNAME_EXIST_EXCEPTION: 'UsernameExistsException',
  TOKEN_VALIDATION_ERROR: 'Error while validating token'
}

export const cognitoUserCreation = {
  SUCCESS: 'User created successfully',
  ERROR: 'Failed to create user'
}

export const cognitoUserAuthentication = {
  SUCCESS: 'Successfully logged in',
  ERROR: {
    EMAIL: 'Email not found',
    USERNAME: 'Username not found',
    PASSWORD: 'Wrong password'
  }
}

export const forgotPasswordRequest = {
  SUCCESS: 'Check your email to reset the password',
  ERROR: 'Error while request for forgot password'
}

export const changePasswordRequest = {
  SUCCESS: 'Change Password Request was successful',
  ERROR: 'Error while changing password'
}
