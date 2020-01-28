import AWS from 'aws-sdk'
import { ses } from 'config'
import { logger } from '../config/logger'

export class EmailService {
    constructor() {
        if (instance) {
            return instance
        }
        instance = this
        if(!this.AWS_SES) {
            this.AWS_SES = new AWS.SES(ses)
        }
    }
    
    constructEmailContent (to, message, subject) {
        return {
            Source: '',
            Destination: {
                To: to
            },
            ReplyToAddresses: [],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: message
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            }
        }
    }

    // Todo create a worker queue and use kue.js for processing jobs
    async sendMail (options) {
        try {
            const {
                to, message, subject
            } = options
            const content = this.constructEmailContent(to, message, subject)
            await this.AWS_SES.sendEmail(content).promise()
            logger.info('Successfully send email ')
        } catch (error) {
          logger.error('Error while sending email ', error)  
        }
    }
}