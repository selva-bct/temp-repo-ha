import connection from '../config/db-conection'
import { logger } from '../config/logger'
import { Role } from './../models/role'

class UserService {
  async getUserList () {
    try {
      return await connection.models.User.findAll({
        include: [{
          model: Role
        }]
      })
    } catch (error) {
      logger.error('Error while getting user list', error)
    }
  }

  async getUserById (userId) {
    try {
      return await connection.models.User.getUserById(userId)
    } catch (error) {
      logger.error('Error while getting user ', error)
    }
  }

  async getRoleList () {
    try {
      return await connection.models.Role.findAll()
    } catch (error) {
      logger.error('Error while getting role list', error)
    }
  }

  async getUser (username) {
    try {
      return await connection.models.User.findAll({
        where: {
          username: username
        },
        include: [{
          model: Role
        }]
      })
    } catch (error) {
      logger.error('Error while getting user ', error)
    }
  }
}

export default new UserService()
