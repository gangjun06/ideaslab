import { LogLevel } from 'types'

export default {
  logLevel: (process.env.LOG_LEVEL ?? 'debug') as LogLevel,
  botToken: process.env.BOT_TOKEN as string,
  botId: process.env.BOT_ID as string,
  errorWebhook: (process.env.ERROR_WEBHOOK ?? '') as string,
  redisURL: (process.env.REDIS_URL ?? '') as string,
  jwtSecret: (process.env.JWT_SECRET ?? '') as string,
  redisPrefix: (process.env.REDIS_PREFIX ?? '') as string,
  webURL: (process.env.WEB_URL ?? '') as string,
  guildId: (process.env.GUILD_ID ?? '') as string,
}
