import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'

export const Contact = sequelize.define('Contact', {
  contactId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contactNickname: {
    type: Sequelize.STRING

  },
  phoneNumber: {
    type: Sequelize.INTEGER

  }
}, {
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'contact'
  // ,
  // indexes: [
  //     {
  //         unique: true,
  //         fields: ['phoneNumber']
  //     }
  // ]
})
