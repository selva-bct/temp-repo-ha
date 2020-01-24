// external package
import { cognito } from 'config'
import AWS from 'aws-sdk'
import { promisify } from 'util'

import { logger } from '../config/logger'
import { userService } from '../service'

class CognitoService {
    constructor() {
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

    async login(username, password) {
        try {
            logger.info('login user')
            const params = {
                UserPoolId: cognito.userPoolId,
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                ClientId: cognito.appClientId,
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password
                }
            }
            return  await promisify(this.cognitoClient.adminInitiateAuth.bind(this.cognitoClient, params))()
            // if (result !== null) {
            //     this.loginAttempts(username)
            //     return result
            // }
        } catch (error) {
            logger.error('Error while login user')
            this.updateFailAttempts(username)

            throw error
        }
    }

    async updateFailAttempts(username) {
        try {
            logger.info('update login failed attempts')
            const userAttempts = await userService.getUser(username)
            if (userAttempts !== null) {
                const data = {
                    username: username,
                    loginAttempts: userAttempts.loginAttempts + 1
                }
                userService.updateUser(data)
            }
        } catch (error) {
            logger.error('Error while updating login Failed Attempts')
        }
    }

    async resetFailAttempts(username) {
        try {
            logger.info('Reset login failed attempts')
            const userAttempts = await userService.getUser(username)
            if (userAttempts !== null) {
                const data = {
                    username: username,
                    loginAttempts: 0
                }
                userService.updateUser(data)
            }
        } catch (error) {
            logger.error('Error while reseting login Failed Attempts')
        }
    }
}

export default new CognitoService()
