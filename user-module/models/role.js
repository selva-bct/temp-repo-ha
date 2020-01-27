import Sequelize from 'sequelize'
import sequelize from './../config/db-conection'

export const Role = sequelize.define('Role', {
  roleId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: Sequelize.STRING

  }
}, {
  timestamps: true,
  underscored: true,
  paranoid: true,
  tableName: 'role',
  indexes: [
    {
      unique: true,
      fields: ['role']
    }
  ]
})


sequelize.sync().then(async () => {
  const a = await Role.findOne({})
  console.log(a)
})

/*
  Creating default roles
*/
// sequelize.sync().then(async ()=> {
//   // default roles are created
//   await Role.create({
//     role: 'patient'
//   })

//   await Role.create({
//     role: 'provider'
//   })
// })