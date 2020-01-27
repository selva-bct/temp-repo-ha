
module.exports = {

  cognito: {

    userPoolId: '',

    appClientId: '',

    poolRegion: '',

    accessKeyId: '',

    secretAccessKey: '',

    apiVersion: '2016-04-18',

    loggerConfig: {

      stream: process.stdout,

      level: 'trace'

    }

  },

  dbProperties: {

    database: 'gep2',

    username: 'postgres',

    password: 'postgres',

    host: 'localhost',

    dialect: 'postgres',

    port: 5432

  }

}
