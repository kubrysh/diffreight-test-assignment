import env from '#start/env'

import { defineConfig } from '@adonisjs/redis'

const redisConfig = defineConfig({
  connection: 'default',
  connections: {
    default: {
      host: env.get('REDIS_HOST', 'localhost'),
      port: env.get('REDIS_PORT', 6379),
      password: env.get('REDIS_PASSWORD', ''),
      db: env.get('REDIS_DB', 0),
    },
  },
})

export default redisConfig
