import AWS from 'aws-sdk'
import { ses, sourceEmailAddress } from 'config'
import { logger } from '../config/logger'
let instance
export class EmailService {
    constructor() {
        if (instance) {
            return instance
        }
        instance = this
        if (!this.AWS_SES) {
            AWS.config.update({
                region: 'ap-south-1',
                secretAccessKey: '9ukPiu8jy0MK+pRFnBzarRwpjodplEFAn9KeRyeQ',
                accessKeyId: 'AKIAT63XT7FYXEGTNJLN',
                apiVersion: '2010-12-01'
            });
            this.AWS_SES = new AWS.SES(ses)
        }
    }
    // Todo create a worker queue and use kue.js for processing jobs
    async sendMail(options) {
        try {
            const {
                to, message, subject
            } = options
            await this.AWS_SES.sendEmail({
                Source: sourceEmailAddress,
                Destination: {
                    ToAddresses: to
                },
                Message: {
                    Subject: {
                        Data: subject,
                        Charset: 'UTF-8'
                    },
                    Body: {
                        Html: {
                            Data: message,
                            Charset: 'UTF-8'
                        }
                    }
                }
            }).promise()
            logger.info('Successfully send email ')
        } catch (error) {
            logger.error('Error while sending email ', error)
        }
    }
}