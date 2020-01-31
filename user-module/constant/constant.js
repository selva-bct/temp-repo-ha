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
  TOKEN_VALIDATION_ERROR: 'Error while validating token',
  MANDATORY_FIELDS_MISSING: 'Mandatory fields are missing',
  USER_ALREADY_EXIST: 'User already exits'
}

export const cognitoUserCreation = {
  SUCCESS: 'User created successfully',
  ERROR: 'Failed to create user'
}
