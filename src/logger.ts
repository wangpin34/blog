import pino from 'pino'

const mixin = {
    appName: 'blog cli'
}

const logger = pino({
  name: 'blog-cli',
  level: process.env.LOG_LEVEL ?? process.env.NODE_ENV === 'DEVELOPMENT' ? 'silent' : 'info',
  mixin() {
      return {
        ...mixin,
        timestamp: Date.now().toLocaleString()
      }
  }
})

logger.trace('this is trace level log')

export default logger