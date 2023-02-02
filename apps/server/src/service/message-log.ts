import { dbClient, Prisma } from '@ideaslab/db'

import config from '~/config'
import { redis } from '~/lib/redis'
import { Logger } from '~/utils/logger'

const logger = new Logger('service:message-log')

const redisMessageLogKey = (targetDate?: Date) => {
  const date = targetDate ?? new Date()
  return `${
    config.redisPrefix
  }message-log:${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
}

const redisMessageLogExpire = 60 * 60 * 3 // 3 Hours

/**
 * - It will be called by discord messageCreate event
 * - Increase user's message count in redis.
 */
export const incrUserMessageCount = async (userId: string) => {
  await redis.hincrby(redisMessageLogKey(), userId, 1)
}

/**
 * - It will be called by cron (every 1 hour).
 * - Save all user's message count in last hour to postgresdb.
 */
export const saveMessageCounts = async () => {
  await redis.expire(redisMessageLogKey(), redisMessageLogExpire)

  const targetDate = new Date()
  targetDate.setHours(targetDate.getHours() - 1, 0, 0, 0) // ex) 17:26 -> 14:00

  try {
    const createManyData: Prisma.MessageLogCreateManyInput[] = []
    const scanned = await redis.hscan(redisMessageLogKey(targetDate), 0)
    const [_coursor, elements] = scanned
    const users = await dbClient.user.findMany({ select: { discordId: true } })
    const userIds = users.map(({ discordId }) => discordId)

    for (let i = 0; i < elements.length; i += 2) {
      if (!userIds.includes(elements[i])) continue

      createManyData.push({
        userDiscordId: elements[i],
        count: parseInt(elements[i + 1]),
        time: targetDate,
      })
    }

    await dbClient.messageLog.createMany({ data: createManyData })
    await redis.del(redisMessageLogKey(targetDate))
  } catch (e) {
    logger.error('Failed to scan messages', e)
  }
}
