import pino from 'pino'

const mixin = {
    appName: 'blog cli'
}

const logger = pino({
  name: 'blog-cli',
  level: 'trace',
  mixin() {
      return {
        ...mixin,
        timestamp: Date.now().toLocaleString()
      }
  }
})

export default logger