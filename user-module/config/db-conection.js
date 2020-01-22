import Sequelize from 'sequelize'

import {
    dbProperties
} from 'config'

const { database, username, password, dialect, host, port } = dbProperties
let sequelize
if (!sequelize) {
    
    sequelize = new Sequelize(database, username, password, {
        host,
        dialect,
        port,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    })

    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully')
            require('./../models')
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err)
        })
    
}

export default sequelize