import bunyan from 'bunyan'

const config = require('config')
export const logger = bunyan.createLogger({
  name: 'user-module',
  streams: config.loggerConfig
})
