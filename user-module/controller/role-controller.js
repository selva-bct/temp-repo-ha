// internal package
import { logger } from '../config/logger'
import { ResponseService, UserService, RoleService } from '../service'
import { defaultMessage } from '../constant/constant'

class RoleController {
  constructor() {
    this.responseService = new ResponseService()
    this.userService = new UserService()
    this.roleService =  new RoleService()
  }

  async addRole (req, res) {
    try {
      logger.info('Adding new role')
      const role = req.body
      if (!role) {
        return this.responseService.validationError(res,
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const data = await this.roleService.addRole(role)
      logger.info('Created role successfully')
      this.responseService.onSuccess(res, 'Created role successfully', data)
    } catch (error) {
      logger.error(error, 'Error while creating role')
      this.responseService.onError(res, error)
    }
  }

  async updateRole (req, res) {
    try {
      logger.info('Updating existing role')
      const role = req.body
      if (!role) {
        return this.responseService.validationError(res, 
          new Error(defaultMessage.MANDATORY_FIELDS_MISSING))
      }
      const roleInfo = await this.roleService.getRole(role.roleId)
      if (!roleInfo) {
        return this.responseService.onError(res, defaultMessage.NOT_FOUND)
      }
      await this.roleService.updateRole(role)
      logger.info('Role updated successfully')
      this.responseService.onSuccess(res, 'Role updated successfully')
    } catch (error) {
      logger.error(error, 'Error while updating role')
      this.responseService.onError(res, error)
    }
  }

  async getRole (req, res) {
    try {
      logger.info('Getting role by Id')
      const { id } = req.params
      const data = await this.roleService.getRole(id)
      logger.info('Successfully fetched role')
      this.responseService.onSuccess(res, 'Successfully fetched role', data)
    } catch (error) {
      logger.error(error, 'Error while getting role')
      this.responseService.onError(res, error)
    }
  }

  async getRoleList (req, res) {
    try {
      logger.info('Getting role list')
      const data = await this.roleService.getRoleList()
      logger.info('Successfully fetched roles')
      this.responseService.onSuccess(res, 'Successfully fetched roles', data)
    } catch (error) {
      logger.error(error, 'Error while getting roles')
      this.responseService.onError(res, error)
    }
  }

  async deleteRole (req, res) {
    try {
      logger.info('Deleting role')
      const { id } = req.params
      const role = await this.roleService.getRole(id)
      if (!role) {
        return this.responseService.onError(res, new Error(defaultMessage.NOT_FOUND))
      }
      await this.roleService.deleteRole(id)
      logger.info('Successfully deleted role')
      this.responseService.onSuccess(res, defaultMessage.SUCCESS)
    } catch (error) {
      logger.error(error, 'Error while deleting role')
      this.responseService.onError(res, error)
    }
  }
}

module.exports = RoleController
