import { User, Role, Address } from './../models'
import connection from './config/db-conection'

class UserService {

    static async getUserList() {
        try {
            return await connection.User.findAll({
                include: [{
                    model: Role,
                    
                }]
            });
        } catch (error) {
            throw error;
        }
    }
    static async getUserById(userId) {
        try {
            return await connection.User.getUserById(userId)
        } catch (error) {
            throw error;
        }
    }



}

export default new UserService()