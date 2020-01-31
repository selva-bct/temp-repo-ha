import connection from '../config/db-conection'
import { logger } from '../config/logger'
import { Role } from '../models/role'
import { Address } from '../models/address'

export class UserService {
  constructor () { }

  createUser (user) {
    return new Promise(async (resolve, reject) => {
      try {
        const newUser = await connection.models.User.create(user)
        resolve(newUser)
        logger.info('Successfully created user')
      } catch (error) {
        logger.error('Error while creating user', error)
        reject(error)
      }
    })
  }

  getUserByEmail (email) {
    return new Promise(async (resolve, reject) => {
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

  async getUserList () {
    try {
      return await connection.models.User.findAll({
        include: [{
          model: Role
        },
        {
          model: Address
        }]
      })
    } catch (error) {
      logger.error('Error while getting user list', error)
      throw error
    }
  }

  async updateUser (user) {
    try {
      return await connection.models.User.update(user, { where: { email: (user.email) } })
    } catch (error) {
      logger.error('Error while updating user ', error)
      throw error
    }
  }

  async getUser (email) {
    try {
      return await connection.models.User.findOne({
        where: { email }
      })
    } catch (error) {
      logger.error('Error while getting user ', error)
      throw error
    }
  }

  async getUserById (userId) {
    try {
      return await connection.models.User.findOne({
        where: { userId },
        include: [{
          model: Role
        },
        {
          model: Address
        }]
      })
    } catch (error) {
      logger.error('Error while getting user ', error)
      throw error
    }
  }

  getUserByInviteToken (token) {
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
}
