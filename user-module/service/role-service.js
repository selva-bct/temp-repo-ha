import { logger } from '../config/logger'
import { Role } from './../models/role'
import connection from '../config/db-conection'

export class RoleService {
    constructor() { }
    getRoles() {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into fetching all roles')
                let roles
                // hit the redis layer
                //  if not found 
                // check the postgres db
                if (!roles) {
                    roles = await Role.findAll({})
                } 
                resolve(roles)
                logger.info('Successfully fetched all the roles from db')
            } catch (error) {
                logger.error('Error while fetching the roles', error)
                reject(error)
            }
        })
    }

    getRolesById(roleId) {
        return new Promise(async  (resolve, reject) => {
            try {
                logger.info('Into fetching role by Id ')
                let role
                // hit the redis layer
                //  if not found 
                // check the postgres db
                if (!role) {
                    role = await Role.findById(roleId)
                }
                if (!role) {
                    throw new Error('ROLE_NOT_FOUND')
                }
                resolve(role)
                logger.info('Successfully fetched the role from db')
            } catch (error) {
                logger.error('Error while fetching the role', error)
                reject(error)
            }
        })
    }

    createRole(roleName) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into creating role')
                const query = {
                    role: roleName
                }
                let role = await Role.findOne({
                    where: query
                })
                if(!role) {
                    role = await Role.create(query)
                }
                resolve(role)
                logger.info('Successfully created role')
            } catch (error) {
                logger.error('Error while creating role', error)
                reject(error)
            }
        })        
    }

    updateRole(existingRoleName, newRoleName) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into updating role')
                const query = {
                    role: existingRoleName
                }
                let role = await Role.findOne({
                    where: query
                })
                if(!role) {
                    throw new Error('[ROLE_NOT_FOUND]')
                }
                const updatedRole = await Role.update({
                    role: newRoleName
                }, query)
                resolve({
                    existingRole: query,
                    updatedRole
                })
                logger.info('Successfully updated role')
            } catch (error) {
                logger.error('Error while updating role', error)
                reject(error)
            }
        })        
    }

    deleteRole(roleId) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.info('Into deleting role')
                const role = await Role.findById(roleId)
                if (!role) {
                    throw new Error('ROLE_NOT_FOUND')
                }
                await Role.destroy({
                    where: {
                        roleId: role.roleId
                    }
                })
                logger.info('Successfully deleted user')
                resolve()
            } catch (error) {
                logger.error('Error while deleting user', error)
                reject(error)
            }
        })
    } 

    getRoleByRoleName (roleName) {
        return connection.models.Role.findOne({ where: { role: roleName } })
    }
}
