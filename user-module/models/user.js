import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'
import {Role} from './role'
import {Address} from './address'

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
    status:  {
        type: Sequelize.STRING,
        defaultValue: 'abc'
    },
    lastLogin: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    loginAttempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: {
        type: Sequelize.STRING
    }
}, {
    timestamps: true,
    underscored: true,
    paranoid: true, // remove this if the entities are gonna be hard deleted
    tableName: 'gep_user',
    indexes: [
        {
          unique: true,
          fields: ['email', 'username']
        }
    ]
})

User.belongsToMany(Role,{through: 'gep_user_permission',foreignKey: 'userId',otherKey: 'roleId'})
User.belongsToMany(Address,{through: 'gep_user_address_relation'})


//To insert table test data
sequelize.sync().then(() => Role.create({
    role:"Patient"
  }))
  .then(() => User.create({
    firstName: 'ssssasdsfsg',
    lastName: 'sdfgss',
    email: 'ssdssdfgdsad@mddkfss.df',
    token: 'sdsweasd',
    username: 'wssdasdsa',
    Role:1
  },
  {
    include: [
        Role
    ]
  }))
  
  .then(() => Address.create({
    addressNickname:'abc',
    addressLine1:'xyz',
    city:'Chennai',
    State:'TN',
    zip:'1234'

  }))
  .then(jane => {
    console.log(jane.toJSON());
  });