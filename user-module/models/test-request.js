import Sequelize from 'sequelize'
import sequelize from '../config/db-conection'

export const TestRequest = sequelize.define('TestRequest', {
  testRequestId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trfId: {
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.INTEGER
  },
  formData: {
    type: Sequelize.JSON
  },
  programId: {
    type: Sequelize.INTEGER
  },
  testRequestStatus: {
    type: Sequelize.STRING
  },
  submittedBy: {
    type: Sequelize.STRING
  },
  submittedAt: {
    type: Sequelize.DATE
  },
  reportEstReceiptAt: {
    type: Sequelize.DATE
  },
  reportActReceiptAt: {
    type: Sequelize.DATE
  },
  reportStatus: {
    type: Sequelize.STRING
  },
  resultCount: {
    type: Sequelize.INTEGER
  },
  viewedFlag: {
    type: Sequelize.JSON
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
  tableName: 'ghe_test_request'
})
