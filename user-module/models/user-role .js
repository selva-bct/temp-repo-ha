import Sequelize from 'sequelize'
import sequelize from '../config/db-conection'

export const UserRole = sequelize.define('UserRole', {
  roleId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER

  },
  roleId: {
    type: Sequelize.INTEGER

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
  tableName: 'ghe_user_role'
})
