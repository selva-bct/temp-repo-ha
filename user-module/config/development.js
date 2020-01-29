module.exports = {
  secret: 'abcdefgh',
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
  ses: {
    secretAccessKey: '',
    accessKeyId: '',
    region: 'ap-south-1',
    apiVersion: '2010-12-01'
  },
  dbProperties: {
    database: '',
    username: '',
    password: '',
    host: '',
    dialect: 'postgres',
    port: 5432
  }

}