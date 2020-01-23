import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'

export const Role = sequelize.define('Role', {
    roleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: {
        type: Sequelize.STRING,

    }
}, {
    timestamps: true,
    underscored: true,
    paranoid: true, 
    tableName: 'role',
    indexes: [
        {
            unique: true,
            fields: ['role']
        }
    ]
})

console.log( "Role :: ", Role)