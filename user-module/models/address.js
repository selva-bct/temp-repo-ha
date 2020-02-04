import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'

export const Address = sequelize.define('Address', {
  userAddressId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.INTEGER
  },
  addressNickname: {
    type: Sequelize.STRING,
    defaultValue: 'home'
  },
  addressLine1: {
    type: Sequelize.STRING
  },
  addressLine2: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING
  },
  zip: {
    type: Sequelize.INTEGER
  },
  country: {
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
  },
  deletedAt: {
    type: Sequelize.DATE
  },
  deletedBy: {
    type: Sequelize.INTEGER
  }
}, {
  //schema: dbProperties.schema,
  timestamps: true,
  underscored: true,
  //paranoid: true,
  tableName: 'ghe_user_address'
})
