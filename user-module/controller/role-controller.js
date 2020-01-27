// internal package
import { logger } from '../config/logger'
import { responseService, userService } from '../service'
import { defaultMessage } from '../constant/constant'

class RoleController {
  async addRole (req, res) {
    try {
      logger.info('Adding new role')
      const role = req.body
      if (!(role)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const data = await userService.addRole(role)
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async updateRole (req, res) {
    try {
      logger.info('Updating existing role')
      const role = req.body
      if (!(role)) {
        return responseService.validationError(res, defaultMessage.VALIDATION_ERROR)
      }
      const roleInfo = await userService.getRole(role.roleId)
      if (!roleInfo) {
        return responseService.onError(res, defaultMessage.NOT_FOUND)
      }
      await userService.updateRole(role)
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async getRole (req, res) {
    try {
      logger.info('Getting role by Id')
      const { id } = req.params
      const data = await userService.getRole(id)
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async getRoleList (req, res) {
    try {
      logger.info('Getting role list')
      const data = await userService.getRoleList()
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS, data)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }

  async deleteRole (req, res) {
    try {
      logger.info('Deleting role')
      const { id } = req.params
      const role = await userService.getRole(id)
      if (!role) {
        return responseService.onError(res, defaultMessage.NOT_FOUND)
      }
      await userService.deleteRole(id)
      logger.info(defaultMessage.SUCCESS)
      responseService.onSuccess(res, defaultMessage.SUCCESS)
    } catch (error) {
      logger.error(error, defaultMessage.ERROR)
      responseService.onError(res, defaultMessage.ERROR, error)
    }
  }
}
module.exports = RoleController
