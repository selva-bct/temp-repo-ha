import RoleController from '../controller/role-controller'
import express from 'express'

const roleRouter = express.Router()
const roleController = new RoleController()

roleRouter
  .post('/addRole', roleController.addRole.bind(roleController))
  .put('/updateRole', roleController.updateRole.bind(roleController))
  .get('/getRole/:id', roleController.getRole.bind(roleController))
  .delete('/deleteRole/:id', roleController.deleteRole.bind(roleController))
  .get('/getRoleList', roleController.getRoleList.bind(roleController))

module.exports = roleRouter
