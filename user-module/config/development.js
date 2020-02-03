module.exports = {
  algorithm: 'aes256',
  secret: 'abcdefgh',
  sourceEmailAddress: 'selvanathan.v@bahwancybertek.com',
  port: 3000,
  host: '192.168.16.68',
  cognito: {
    userPoolId: 'us-east-2_T3COH57rW',
    appClientId: '3a12svjv7dn53n967af08pd4tr',
    poolRegion: 'us-east-2',
    accessKeyId: 'AKIAT63XT7FYTKNHMCWS',
    secretAccessKey: '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',
    apiVersion: '2016-04-18',
    loggerConfig: {
      stream: process.stdout,
      level: 'trace'
    }
  },
  ses: {
    secretAccessKey: '9ukPiu8jy0MK+pRFnBzarRwpjodplEFAn9KeRyeQ',
    accessKeyId: 'AKIAT63XT7FYXEGTNJLN',
    region: 'ap-south-1',
    apiVersion: '2010-12-01'
  },
  dbProperties: {
    // schema: 'hagep',
    database: 'hagep1',
    username: 'postgres',
    password: 'bcthudson',
    host: '192.168.16.68',
    dialect: 'postgres',
    port: 5432
  }

}
