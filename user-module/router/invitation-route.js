import InvitationConteoller from '../controller/invitation-controller'
import express from 'express'
import { validateToken } from './../service/authentication-service'

const conversationRouter = express.Router()
const invitationConteoller = new InvitationConteoller()

conversationRouter
  .post('/', validateToken, invitationConteoller.inviteUser.bind(invitationConteoller))

module.exports = conversationRouter
