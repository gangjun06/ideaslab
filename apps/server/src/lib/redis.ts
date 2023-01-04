import Redis from 'ioredis'

import config from '~/config'
import { Logger } from '~/utils/logger'

const logger = new Logger('redis')

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined
}

export const redis = global.redis || new Redis(config.redisURL)

if (process.env.NODE_ENV !== 'production') global.redis = redis

redis.on('connect', () => {
  logger.info('redis connected')
})

redis.on('error', (err) => {
  logger.error(err)
})
