'use strict'

const config = require('../config')
const { Logger } = require('lambda-logger-node')

const logger = Logger({
  useGlobalErrorHandler: true,
  useBearerRedactor: true
})

logger.setMinimumLogLevel(config.stage === 'prod' ? 'INFO' : 'DEBUG')

module.exports = logger
