import connection from '../config/db-conection'
import { logger } from '../config/logger'
import { Role } from './../models/role'
import { Address } from '../models/address'

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

  // need to verify all the above methods
  getRoleByRoleName (roleName) {
    return connection.models.Role.findOne({ where: { role: roleName } })
  }

  getUserByInviteToken (token) {
    return connection.models.User.findOne({
      // where: {
      //   inviteToken: token,
      //   include: [{
      //     model: connection.models.Role
      //   }
      //   , {
      //     model: connection.models.Address
      //   }
      // ]
      // }
      include: [{
        model: connection.models.Role
      }, {
        model: connection.models.Address
      }]
    })
  }

  createUser (user) {
    return connection.models.User.create(user)
  }

}

export default new UserService()
