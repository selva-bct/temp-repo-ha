import bunyan from 'bunyan'

const config = require('config')
let logger
if (process.enc === 'production') {
  logger = bunyan.createLogger({
    name: 'user-module',
    streams: config.loggerConfig
  })
} else {
  logger = console
}

export {
  logger
}
