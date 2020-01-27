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
  // need to get clarification
  status: {
    type: Sequelize.STRING,
    defaultValue: 'invited'
  },
  lastLogin: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  loginAttempts: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  inviteToken: {
    type: Sequelize.TEXT
  }
}, {
  timestamps: true,
  underscored: true,
  paranoid: true, // remove this if the entities are gonna be hard deleted
  tableName: 'user',
  indexes: [
    {
      unique: true,
      fields: ['email', 'username']
    }
  ]
})

User.belongsToMany(Role, { through: 'user_permission' })
Role.belongsToMany(User, { through: 'user_permission' })

User.hasMany(Address)
User.hasMany(Contact)

// To insert table test data
// sequelize.sync()
//     .then(async () => {
//         const newUser = await User.create({
//             firstName: 'qsadsrsadssdw',
//             lastName: 'qsrssw',
//             email: 'qrssssw@ssqw.com',
//             token: 'qrssw',
//             username: 'qssasadassw'
//         })
//         const fetchedRole = await Role.findAll({
//             where: {
//                 role: 'Patient'
//             }
//         })
//         await newUser.addRoles(fetchedRole)
//     })
