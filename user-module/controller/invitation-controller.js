import crypto from 'crypto'
import { secret, host, port } from 'config'

// internal package
import { logger } from '../config/logger'
import { Address } from '../models/address'
import { UserRole } from '../models/user-role'
import { User } from '../models/user'

import { ResponseService, EmailService } from '../service'

import { setCreatedBy } from '../service/util'
import { defaultMessage } from '../constant/constant'

class InvitationController {
  constructor () {
    this.responseService = new ResponseService()
    this.emailService = new EmailService()
  }

  async inviteUser (req, res) {
    try {
      logger.info('Into invite user')
      const { body } = req
      let user = body
      if (!(user)) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const hash = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(body))
        .digest('hex')
      user = {
        ...user,
        tokenValue: hash,
        userStatus: 'invited'
      }

      const userInfo = await User.findOne({ where: { email: user.email } })
      if (userInfo) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.USER_ALREADY_EXIST))
      }
      //user = setCreatedBy(user, req.user)
      const newUser = await User.create(user)
      // save the address
      // assign the newly created address to the user
      let address = user.address
      address.userId = newUser.userId
      address = setCreatedBy(address, user.address)
      console.log('address--->', address)
      await Address.create(address)
      let role = user.role
      role.userId = newUser.userId
      role = setCreatedBy(role, user.role)
      console.log('role====>', role)
      // inserting user role record
      await UserRole.create(role)

      console.log('Email Invite link  ::: ', `http://localhost:3000/auth/signup/${hash}`)
      this.emailService.sendMail({
        to: [newUser.email],
        subject: 'GEP Invite',
        message: `http://${host}:${port}/auth/signup/${hash}`
      })
      // Todo:: need to send email
      logger.info('sucessfully created the user')
      this.responseService.onSuccess(res, 'user invited successfully')
    } catch (error) {
      logger.info('error creating the user', error)
      this.responseService.onError(res, error)
    }
  }
}

module.exports = InvitationController
