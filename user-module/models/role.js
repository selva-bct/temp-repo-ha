import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'

export const Role = sequelize.define('Role', {
  roleId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: Sequelize.JSON

  },
  roleDescription: {
    type: Sequelize.JSON

  },
  createdBy: {
    type: Sequelize.INTEGER
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  },
  updatedBy: {
    type: Sequelize.INTEGER
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'ghe_role',
  indexes: [
    {
      unique: true,
      fields: ['role']
    }
  ]
})
