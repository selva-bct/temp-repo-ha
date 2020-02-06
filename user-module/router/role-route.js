import RoleController from '../controller/role-controller'
import { validateToken } from './../service/authentication-service'
import express from 'express'

const roleRouter = express.Router()
const roleController = new RoleController()

roleRouter
  .get('/', validateToken, roleController.getRoleList.bind(roleController))

module.exports = roleRouter
