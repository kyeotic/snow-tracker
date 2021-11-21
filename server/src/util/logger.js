import config from '../config.js'
import { Logger } from 'lambda-logger-node'

const logger = Logger({
  useGlobalErrorHandler: true,
  useBearerRedactor: true,
})

logger.setMinimumLogLevel(config.stage === 'prod' ? 'INFO' : 'DEBUG')

export default logger
