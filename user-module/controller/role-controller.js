import { logger } from '../config/logger'
import { ResponseService } from '../service'
import { Role } from '../models/role'

class RoleController {
  constructor () {
    this.responseService = new ResponseService()
  }

  async getRoleList (req, res) {
    try {
      logger.info('Getting role list')
      const data = await Role.findAll()
      logger.info('Successfully fetched roles')
      this.responseService.onSuccess(res, 'Successfully fetched roles', data)
    } catch (error) {
      logger.error(error, 'Error while getting roles')
      this.responseService.onError(res, error)
    }
  }
}

module.exports = RoleController
