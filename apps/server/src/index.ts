import 'dotenv/config'
import 'module-alias/register'
import { Logger } from '~/utils/logger'
import config from './config'

import BotClient from './bot/client'
import { exit } from 'process'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { appRouter } from './router/_app'
import { createContext } from './api/context'

const logger = new Logger('main')

logger.log('Starting up...')

process.on('uncaughtException', (e) => logger.error(e.stack as string))
process.on('unhandledRejection', (e: Error) => logger.error(e.stack as string))

const client = new BotClient()

if (process.argv.includes('--register')) {
  logger.info('Registering slash commands...')
  client.command.slashCommandSetup(process.env.TEST_GUILD_ID ?? '').then(() => {
    exit(1)
  })
  process.stdin.resume()
} else {
  client.start(config.botToken)

  logger.info('Create HTTPS Server')

  createHTTPServer({
    router: appRouter,
    createContext,
  }).listen(2022)
}
