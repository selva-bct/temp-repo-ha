import Sequelize from 'sequelize'
import sequelize from '../config/db-conection'

export const Program = sequelize.define('Program', {
  programId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  programName: {
    type: Sequelize.JSON
  },
  programStatus: {
    type: Sequelize.STRING
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
  tableName: 'ghe_program'
})
