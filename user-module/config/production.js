const path = require('path')
const fs = require('fs-extra')
const logFilePath = path.join(__dirname, './../tmp/user-module.log')

fs.ensureFileSync(logFilePath)

module.exports = {
  cognito: {
    userPoolId: '',
    appClientId: '',
    poolRegion: '',
    accessKeyId: '',
    secretAccessKey: '',
    apiVersion: '',
    loggerConfig: {
      type: 'rotating-file',
      path: logFilePath,
      period: '1w'
    }
  }
}
