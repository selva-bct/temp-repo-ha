import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'
import { Role } from './role'
import { Address } from './address'
import { Contact } from './contact'

export const User = sequelize.define('User', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  userStatus: {
    type: Sequelize.STRING
  },
  registeredAt: {
    type: Sequelize.DATE
  },
  locale: {
    type: Sequelize.STRING
  },
  lastLoginAt: {
    type: Sequelize.DATE
  },
  loginAttempts: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  tokenValue: {
    type: Sequelize.STRING
  },
  tokenSentAt: {
    type: Sequelize.DATE
  },
  tokenExpiryDur: {
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
  tableName: 'ghe_user',
  indexes: [
    {
      unique: true,
      fields: ['email', 'username']
    }
  ]
})

Role.belongsToMany(User, { through: 'ghe_user_role', foreignKey: 'roleId' })
User.belongsToMany(Role, { through: 'ghe_user_role', foreignKey: 'userId' })

User.hasMany(Address, { foreignKey: 'userId' })
User.hasMany(Contact)

// // To insert table test data
// sequelize.sync()
//     .then(async () => {
//         const newUser = await User.create({
//             firstName: 'Test',
//             lastName: 'Test',
//             email: 'Test@bahwancybertek.com',
//             token: 'qsfafas',
//             username: 'Test'
//         })
//         const fetchedRole = await Role.findAll({
//             where: {
//                 role: 'Patient'
//             }
//         })
//         await newUser.addRoles(fetchedRole)
//     })
