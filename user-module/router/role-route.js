import RoleController from '../controller/role-controller'
import express from 'express'

const roleRouter = express.Router()
const roleController = new RoleController()

roleRouter
  .post('/', roleController.addRole.bind(roleController))
  .put('/', roleController.updateRole.bind(roleController))
  .get('/:id', roleController.getRole.bind(roleController))
  .delete('/:id', roleController.deleteRole.bind(roleController))
  .get('/', roleController.getRoleList.bind(roleController))

module.exports = roleRouter
