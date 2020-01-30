import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'
import { dbProperties } from 'config'

export const Role = sequelize.define('Role', {
  roleId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: Sequelize.STRING

  }
}, {
  schema: dbProperties.schema,
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

// sequelize.sync().then(async()=> {
//   await Role.create({
//     role: 'Patient'
//   })
// })
