import config from '~/config'
import { redis } from '~/lib/redis'
import { dbClient } from '@ideaslab/db'

enum SettingValueType {
  String = 'string',
  Channel = 'channel',
  Number = 'number',
  Tag = 'tag',
  Boolean = 'boolean',
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

export const settingDescriptions: {
  [key in SettingKeys]: string
} = {
  afkChannel: '잠수 채널을 설정합니다',
  voiceRoomCreateChannel: '음성채널을 생성하는 채널을 설정합니다 ',
  achieveForumEatTag: '',
  achieveForumWorkTag: '',
}

export const setSetting = async <T extends SettingKeys>(
  key: SettingKeys,
  value: SettingValueTypeConvert<typeof SettingList[T]>,
) => {
  const stringified = JSON.stringify(value)

  await redis.set(redisSettingKey(key), stringified, 'EX', settingKeyExpire)

  await dbClient.setting.upsert({
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
    const data = await dbClient.setting.findUnique({ where: { key } })
    if (!data) return null
    await redis.set(redisSettingKey(key), data.value, 'EX', settingKeyExpire)

    return JSON.parse(data.value)
  }

  return JSON.parse(value)
}

export const getAllSettings = async () => {
  const values = await dbClient.setting.findMany()

  const result: {
    key: SettingKeys
    value: string | number | boolean | null
    description: string
    type: string
  }[] = values.map(({ key, value }) => ({
    key: key as SettingKeys,
    value: JSON.parse(value),
    type: SettingList[key as SettingKeys].toString(),
    description: settingDescriptions[key as SettingKeys],
  }))

  result.push(
    ...Object.entries(SettingList)
      .filter(([item]) => !values.find((v) => v.key === item))
      .map(([key, value]) => ({
        key: key as SettingKeys,
        type: value.toString(),
        description: settingDescriptions[key as SettingKeys],
        value: null,
      })),
  )

  return result
}
