import pino from 'pino'

const mixin = {
    appName: 'blog cli'
}

const logger = pino({
  name: 'blog-cli',
  level: process.env.NODE_ENV === 'DEVELOPMENT' ? 'trace' : 'info',
  mixin() {
      return {
        ...mixin,
        timestamp: Date.now().toLocaleString()
      }
  }
})

export default logger