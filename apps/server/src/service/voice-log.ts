import config from '~/config'
import { dbClient } from '~/lib/db'
import { redis } from '~/lib/redis'

const redisVoiceKey = (userId: string) => `${config.redisPrefix}voice:${userId}`
const voiceKeyExpire = 60 * 60 * 24 // 1 day

export const eventMemberJoin = async (userId: string) => {
  await redis.set(redisVoiceKey(userId), Date.now(), 'EX', voiceKeyExpire)
}

export const eventMemberLeave = async (userId: string) => {
  const date = await redis.getdel(redisVoiceKey(userId))
  if (!date) return
  const dateInt = parseInt(date)
  const duration = Math.floor((Date.now() - dateInt) / 1000)

  if (duration < 30) return

  const time = new Date(dateInt)

  // If save log when day pass, seperate log into two log
  // ex) 2022-12-24 23:50 ~ 2022-12-25 01:10:00
  // => 2022-12-24 23:50 ~ 2022-12-24 23:59:59
  // => 2022-12-25 00:00:00 ~ 2022-12-25 01:10:00
  if (time.getDate() !== new Date().getDate()) {
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    const todayDuration = Math.floor((todayDate.getTime() - dateInt) / 1000)
    await dbClient.voiceLog.createMany({
      data: [
        { time, userDiscordId: userId, value: duration - todayDuration },
        {
          time: todayDate,
          userDiscordId: userId,
          value: todayDuration,
        },
      ],
    })
    return
  }

  await dbClient.voiceLog.create({
    data: { time, userDiscordId: userId, value: duration },
  })
}

export const getCurrentVoiceLog = async (userId: string) => {
  const date = await redis.get(redisVoiceKey(userId))
  let current: number | null = null
  let today: number | null = null
  let all: number | null = null

  if (date) {
    const dateInt = parseInt(date)
    current = Math.floor((Date.now() - dateInt) / 1000)
  }

  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)

  const tomorrowDate = new Date(todayDate)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)

  const todaySum = await dbClient.voiceLog.groupBy({
    by: ['userDiscordId'],
    _sum: {
      value: true,
    },
    where: {
      time: {
        gte: todayDate,
        lte: tomorrowDate,
      },
      userDiscordId: userId,
    },
  })

  const allSum = await dbClient.voiceLog.groupBy({
    by: ['userDiscordId'],
    _sum: {
      value: true,
    },
    where: {
      userDiscordId: userId,
    },
  })

  if (todaySum[0]) today = todaySum[0]._sum.value
  if (allSum[0]) all = allSum[0]._sum.value

  return { current, today, all }
}

export const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secondsLeft = seconds % 60
  if (hours === 0 && minutes === 0) return `${secondsLeft}초`
  if (hours === 0) return `${minutes}분 ${secondsLeft}초`
  return `${hours}시간 ${minutes}분 ${secondsLeft}초`
}
