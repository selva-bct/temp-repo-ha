import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'
import { Conversation } from './conversation'

export const Message = sequelize.define('Message', {
  msgId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conversationId: {
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.INTEGER
  },
  msgTxt: {
    type: Sequelize.STRING
  },
  msgAt: {
    type: Sequelize.DATE
  },
  viewedFlag: {
    type: Sequelize.INTEGER,
    defaultValue: 0
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
  tableName: 'ghe_conversation_msg'
})

Message.belongsTo(Conversation)
