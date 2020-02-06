import Sequelize from 'sequelize'
import sequelize from '../config/db-conection'

export const UserProgram = sequelize.define('UserProgram', {
  programUserId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  programId: {
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.JSON
  },
  participationStatus: {
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
  tableName: 'ghe_user_program'
})
