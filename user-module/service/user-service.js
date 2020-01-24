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
      throw error
    }
  }

  async updateUser (user) {
    try {
      return await connection.models.User.update(user, { where: { username: (user.username) } })
    } catch (error) {
      logger.error('Error while updating user ', error)
      throw error
    }
  }

  async getUser (username) {
    try {
      return await connection.models.User.findOne({
        where: { username: username },
        include: [{
          model: Role
        }]
      })
    } catch (error) {
      logger.error('Error while getting user ', error)
      throw error
    }
  }

  async addRole (role) {
    try {
      return await connection.models.Role.create(role)
    } catch (error) {
      logger.error('Error while adding role ', error)
      throw error
    }
  }

  async getRole (roleId) {
    try {
      return await connection.models.Role.findOne({ where: { roleId: roleId } })
    } catch (error) {
      logger.error('Error while getting role ', error)
      throw error
    }
  }

  async updateRole (role) {
    try {
      return await connection.models.Role.update(role, { where: { roleId: Number(role.roleId) } })
    } catch (error) {
      logger.error('Error while updating role ', error)
      throw error
    }
  }

  async deleteRole (roleId) {
    try {
      return await connection.models.Role.destroy({ where: { roleId: Number(roleId) } })
    } catch (error) {
      logger.error('Error while deleting role ', error)
      throw error
    }
  }

  async getRoleList () {
    try {
      return await connection.models.Role.findAll()
    } catch (error) {
      logger.error('Error while getting role list', error)
      throw error
    }
  }
}

export default new UserService()
