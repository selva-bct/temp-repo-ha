import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'
import { dbProperties } from 'config'

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

  }
}, {
  schema: dbProperties.schema,
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'ghe_contact'
})
