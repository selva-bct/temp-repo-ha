import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'

export const Contact = sequelize.define('Contact', {
  userContactId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER

  },
  contactNickname: {
    type: Sequelize.STRING

  },
  phoneNumber: {
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
 // schema: dbProperties.schema,
  timestamps: true,
  underscored: true,
 // paranoid: true,
  tableName: 'ghe_contact'
})
