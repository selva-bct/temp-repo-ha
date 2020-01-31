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
    type: Sequelize.JSON

  }
}, {
  schema: dbProperties.schema,
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'ghe_role',
  indexes: [
    {
      unique: true,
      fields: ['role']
    }
  ]
})
