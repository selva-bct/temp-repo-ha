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


  async createUser (user) {
    try {
      return await connection.models.User.create(user)
    } catch (error) {
      logger.error('Error while updating user ', error)
    }
  }

  async updateUser (user) {
    try {
      return await connection.models.User.update(user, { where: { userId: Number(user.userId) } })
    } catch (error) {
      logger.error('Error while updating user ', error)
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
    }
  }

  async addRole (role) {
    try {
      console.log(role, '----role info')
      return await connection.models.Role.create(role)
    } catch (error) {
      logger.error('Error while adding role ', error)
    }
  }

  async getRole (roleId) {
    try {
      return await connection.models.Role.findOne({ where: { roleId: roleId } })
    } catch (error) {
      logger.error('Error while getting role ', error)
    }
  }

  async getRoleByRoleName (roleName) {
    try {
      return await connection.models.Role.findOne({ where: { role: roleName } })
    } catch (error) {
      logger.error('Error while getting role ', error)
    }
  }

  async updateRole (role) {
    try {
      return await connection.models.Role.update(role, { where: { roleId: Number(role.roleId) } })
    } catch (error) {
      logger.error('Error while updating role ', error)
    }
  }

  async deleteRole (roleId) {
    try {
      return await connection.models.Role.destroy({ where: { roleId: Number(roleId) } })
    } catch (error) {
      logger.error('Error while deleting role ', error)
    }
  }

  async getRoleList () {
    try {
      return await connection.models.Role.findAll()
    } catch (error) {
      logger.error('Error while getting role list', error)
    }
  }
}

export default new UserService()
