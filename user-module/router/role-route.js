import RoleController from '../controller/role-controller'
import { validateToken } from './../service/authentication-service'
import express from 'express'

const roleRouter = express.Router()
const roleController = new RoleController()

roleRouter
  .post('/', validateToken, roleController.addRole.bind(roleController))
  .put('/', validateToken, roleController.updateRole.bind(roleController))
  .get('/:id', validateToken, roleController.getRole.bind(roleController))
  .delete('/:id', validateToken, roleController.deleteRole.bind(roleController))
  .get('/', validateToken, roleController.getRoleList.bind(roleController))

module.exports = roleRouter
