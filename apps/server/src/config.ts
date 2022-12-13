import { LogLevel } from 'types'

export default {
  logLevel: (process.env.LOG_LEVEL ?? 'debug') as LogLevel,
  botToken: process.env.BOT_TOKEN as string,
  botId: process.env.BOT_ID as string,
  errorWebhook: process.env.ERROR_WEBHOOK ?? ('' as string),
}
