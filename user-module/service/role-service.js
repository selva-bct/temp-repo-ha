import { logger } from '../config/logger'
import connection from '../config/db-conection'

export class RoleService {
    constructor() { }

    async addRole(role) {
        try {
            return await connection.models.Role.create(role)
        } catch (error) {
            logger.error('Error while adding role ', error)
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

    async getRoleList() {
        try {
            return await connection.models.Role.findAll()
        } catch (error) {
            logger.error('Error while getting role list', error)
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

    async deleteRole(roleId) {
        try {
            return await connection.models.Role.destroy({ where: { roleId: Number(roleId) } })
        } catch (error) {
            logger.error('Error while deleting role ', error)
            throw error
        }
    }
}

