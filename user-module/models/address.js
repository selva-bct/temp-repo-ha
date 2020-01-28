import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'

export const Address = sequelize.define('Address', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  addressNickname: {
    type: Sequelize.STRING
  },
  addressLine1: {
    type: Sequelize.STRING
  },
  addressLine2: {
    type: Sequelize.STRING
  },
  addressLine3: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING
  },
  zipCode: {
    type: Sequelize.INTEGER
  },
  country: {
    type: Sequelize.STRING
  }
}, {
  // schema:'hagep',
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'address'
})
