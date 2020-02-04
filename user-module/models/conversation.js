import Sequelize from 'sequelize'
import sequelize from '../config/db-conection'

export const Conversation = sequelize.define('Conversation', {
  conversationId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  members: {
    type: Sequelize.JSON
  },
  testRequestId: {
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
  tableName: 'ghe_conversation'
})
