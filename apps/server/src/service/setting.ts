import config from '~/config'
import { redis } from '~/lib/redis'
import { prisma } from '@ideaslab/db'

enum SettingValueType {
  String,
  Channel,
  Number,
  Tag,
  Boolean,
}

const SettingList = {
  afkChannel: SettingValueType.Channel,
  voiceRoomCreateChannel: SettingValueType.Channel,
  achieveForumEatTag: SettingValueType.Tag,
  achieveForumWorkTag: SettingValueType.Tag,
} as const

type SettingKeys = keyof typeof SettingList

type SettingValueTypeConvert<T extends SettingValueType> = T extends SettingValueType.String
  ? string
  : T extends SettingValueType.Channel
  ? string
  : T extends SettingValueType.Number
  ? number
  : T extends SettingValueType.Boolean
  ? boolean
  : never

const redisSettingKey = (key: SettingKeys) => `${config.redisPrefix}setting:${key}`
const settingKeyExpire = 60 * 60 * 24 // 1 day

export const settingDescription: {
  [key in SettingKeys]: string
} = {
  afkChannel: '',
  voiceRoomCreateChannel: '',
  achieveForumEatTag: '',
  achieveForumWorkTag: '',
}

export const setSetting = async <T extends SettingKeys>(
  key: SettingKeys,
  value: SettingValueTypeConvert<typeof SettingList[T]>,
) => {
  const stringified = JSON.stringify(value)

  await redis.set(redisSettingKey(key), stringified, 'EX', settingKeyExpire)

  await prisma.setting.upsert({
    where: { key },
    create: {
      key,
      value: stringified,
    },
    update: {
      value: stringified,
    },
  })
}

export const getSetting = async <T extends SettingKeys>(
  key: SettingKeys,
): Promise<SettingValueTypeConvert<typeof SettingList[T]> | null> => {
  const value = await redis.get(redisSettingKey(key))

  if (value === null) {
    const data = await prisma.setting.findUnique({ where: { key } })
    if (!data) return null
    await redis.set(redisSettingKey(key), data.value, 'EX', settingKeyExpire)

    return JSON.parse(data.value)
  }

  return JSON.parse(value)
}
