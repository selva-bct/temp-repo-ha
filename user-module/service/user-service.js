import connection from '../config/db-conection'
import { logger } from '../config/logger'
import { Role } from '../models/role'

export class UserService {
  constructor() { }

  createUser (user) {
    return new Promise(async(resolve, reject) => {
      try {
        if (!user) {
          const error = new Error('EMPTY_USER_OBJECT')
          return reject(error)
        }
        const oldUser = await this.getUserByEmail(user.email)
        if (oldUser) {
          const error = new Error('USER_ALREADY_EXIST')
          return reject(error)
        }
        const newUser = await connection.models.User.create(user)
        resolve(newUser)
        logger.info('Successfully created user')
      } catch (error) {
        logger.error('Error while creating user', error)
        reject(error)
      }
    })
  }

  getUserByEmail(email) {
    return new Promise(async(resolve, reject) => {
      try {
        const user = await connection.models.User.findOne({
          where: {
            email: email
          }
        })
        resolve(user)
      } catch (error) {
        reject(error)
      }
    })
  }
  async getUserList() {
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

  updateUser(user) {
    // Todo: nedd to update user by id not by email.
    // If update by email is needed write a separate email.
    return new Promise(async (resolve, reject) => {
      try {
        const oldUser = await connection.models.User.findOne({ where: { email: user.email }})
        const data = {
          ...oldUser,
          ...user
        }
        const updatedUser = await connection.models.User.update(data, { where: { email: user.email } })
        resolve(updatedUser)
      } catch (error) {
        logger.error('Error while updating user ', error)
        reject(error)
      }
    })
  }

  async getUser(username) {
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

  async addRole(role) {
    try {
      return await connection.models.Role.create(role)
    } catch (error) {
      logger.error('Error while adding role ', error)
      throw error
    }
  }

  async getRole(roleId) {
    try {
      return await connection.models.Role.findOne({ where: { roleId: roleId } })
    } catch (error) {
      logger.error('Error while getting role ', error)
      throw error
    }
  }

  async updateRole(role) {
    try {
      return await connection.models.Role.update(role, { where: { roleId: Number(role.roleId) } })
    } catch (error) {
      logger.error('Error while updating role ', error)
      throw error
    }
  }

  getUserByInviteToken(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await connection.models.User.findOne({
          include: [
            {
              model: connection.models.Role
            }, {
              model: connection.models.Address
            }
          ],
          // attribute: 
          where: {
            inviteToken: token
          }
          // need to add token to this
        })
        resolve(user)
        logger.info('Successfully fetched user by invite token')
      } catch (error) {
        logger.error('Error while fetching user by invite token', error)
        reject(error)
      }
    })
  }

  async deleteRole(roleId) {
    try {
      return await connection.models.Role.destroy({ where: { roleId: Number(roleId) } })
    } catch (error) {
      logger.error('Error while deleting role ', error)
      throw error
    }
  }

  async getRoleList() {
    try {
      return await connection.models.Role.findAll()
    } catch (error) {
      logger.error('Error while getting role list', error)
      throw error
    }
  }
}

