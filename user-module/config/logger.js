import bunyan from 'bunyan'
const path = require('path')
const fs = require('fs-extra')
const logFilePath = path.join(__dirname, './../tmp/user-module.log')

fs.ensureFileSync(logFilePath)

export const logger = bunyan.createLogger({
  name: 'user-module',
  streams: [
    {
      type: 'rotating-file',
      path: logFilePath,
      period: '1d'
    }
  ]
})
