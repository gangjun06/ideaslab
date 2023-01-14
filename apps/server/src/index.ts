// import 'module-alias/register'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import http from 'http'
import { exit } from 'process'

import { createContext } from '~/api/base/context'
import { client, initClient } from '~/bot/base/client'
import { Logger } from '~/utils/logger'

import { appRouter } from './api/router/_app'
import config from './config'

import 'dotenv/config'

export type { AppRouter } from '~/api/router/_app'

const logger = new Logger('main')

logger.log('Starting up...')

process.on('uncaughtException', (e) => logger.error(e.stack as string))
process.on('unhandledRejection', (e: Error) => logger.error(e.stack as string))

initClient()

if (process.argv.includes('--register')) {
  logger.info('Registering slash commands...')
  client.command.slashCommandSetup(process.env.TEST_GUILD_ID ?? '').then(() => {
    exit(1)
  })
  process.stdin.resume()
} else {
  client.start(config.botToken)

  logger.info('Create HTTPS Server')

  const trpcHandler = createHTTPHandler({
    router: appRouter,
    createContext,
    responseMeta({ errors }) {
      if (errors.length > 0) {
        return {}
      }

      const ONE_DAY_IN_SECONDS = 60 * 60 * 24

      return {
        headers: {
          'cache-control': `private, s-maxage=2, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      }
    },
  })

  http
    .createServer((req, res) => {
      // act on the req/res objects

      // enable CORS
      res.setHeader(
        'Access-Control-Allow-Origin',
        process.env.NODE_ENV === 'development' ? '*' : config.webURL,
      )
      res.setHeader('Access-Control-Request-Method', '*')
      res.setHeader('Access-Control-Allow-Methods', '*')
      res.setHeader('Access-Control-Allow-Headers', '*')
      res.setHeader('Access-Control-Max-Age', '86400')
      res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie')

      // accepts OPTIONS
      if (req.method === 'OPTIONS') {
        res.setHeader('Cache-Control', 'public, max-age=86400')
        res.setHeader('Vary', 'Access-Control-Request-Headers, Access-Control-Request-Method')
        res.writeHead(200)
        return res.end()
      }

      // then we can pass the req/res to the tRPC handler
      trpcHandler(req, res)
    })
    .listen(4000)
}
