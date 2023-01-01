import 'dotenv/config'
import 'module-alias/register'
import { Logger } from '~/utils/logger'
import config from './config'

import http from 'http'
import BotClient, { client, initClient } from '~/bot/base/client'
import { exit } from 'process'
import { createHTTPHandler } from '@trpc/server/adapters/standalone'
import { createContext } from '~/api/base/context'
import { appRouter } from './api/router/_app'

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
  })

  http
    .createServer((req, res) => {
      // act on the req/res objects

      // enable CORS
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Request-Method', '*')
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
      res.setHeader('Access-Control-Allow-Headers', '*')

      // accepts OPTIONS
      if (req.method === 'OPTIONS') {
        res.writeHead(200)
        return res.end()
      }

      // then we can pass the req/res to the tRPC handler
      trpcHandler(req, res)
    })
    .listen(2022)
}
