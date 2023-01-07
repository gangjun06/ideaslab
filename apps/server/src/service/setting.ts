import config from '~/config'
import { dbClient } from '~/lib/db'
import { redis } from '~/lib/redis'

enum SettingValueType {
  String = 'string',
  LongText = 'longText',
  Channel = 'channel',
  Category = 'category',
  Number = 'number',
  Tag = 'tag',
  Boolean = 'boolean',
  Role = 'role',
}

const SettingList = {
  afkChannel: SettingValueType.Channel,
  voiceRoomCreateChannel: SettingValueType.Channel,
  voiceRoomCategory: SettingValueType.Category,
  userRole: SettingValueType.Role,
  achieveForumEatTag: SettingValueType.Tag,
  achieveForumWorkTag: SettingValueType.Tag,
  privacyPolicy: SettingValueType.LongText,
  serverRule: SettingValueType.LongText,
  serviceInfo: SettingValueType.LongText,
  welcomeChannel: SettingValueType.Channel,
  welcomeMessage: SettingValueType.LongText,
} as const

type SettingKeys = keyof typeof SettingList

type SettingValueTypeConvert<T extends SettingValueType> = T extends SettingValueType.String
  ? string
  : T extends SettingValueType.Channel
  ? string
  : T extends SettingValueType.Role
  ? string
  : T extends SettingValueType.LongText
  ? string
  : T extends SettingValueType.Number
  ? number
  : T extends SettingValueType.Boolean
  ? boolean
  : never

const redisSettingKey = (key: SettingKeys) => `${config.redisPrefix}setting:${key}`
const settingKeyExpire = 60 * 60 * 24 // 1 day

export const settingDetails: {
  [key in SettingKeys]: {
    description: string
    cache: boolean
  }
} = {
  afkChannel: {
    description: '잠수 채널을 설정합니다',
    cache: true,
  },
  welcomeChannel: {
    description: '새로운 유저가 입장했을때, 반겨줄 채널을 설정해요.',
    cache: true,
  },
  welcomeMessage: {
    description:
      '새로운 유저가 입장했을때, 반겨줄 메시지를 설정해요. <name>, <mention> 을 사용할 수 있어요.',
    cache: false,
  },
  voiceRoomCreateChannel: {
    description: '음성채널을 생성하는 채널을 설정합니다.',
    cache: true,
  },
  voiceRoomCategory: {
    description: '음성채널의 카테고리를 설정합니다.',
    cache: true,
  },
  userRole: {
    description: '유저역할을 설정합니다.',
    cache: true,
  },
  privacyPolicy: {
    description: '개인정보 처리방침. 마크다운 문법 사용.',
    cache: false,
  },
  serverRule: {
    description: '디스코드 서버 규칙. **초록색 강조** **!빨간색 강조**',
    cache: false,
  },
  serviceInfo: {
    description: '웹사이트 정보. 마크다운 문법 사용',
    cache: false,
  },
  achieveForumEatTag: {
    description: '',
    cache: true,
  },
  achieveForumWorkTag: {
    description: '',
    cache: true,
  },
}

export const setSetting = async <T extends SettingKeys>(
  key: SettingKeys,
  value: SettingValueTypeConvert<typeof SettingList[T]>,
) => {
  const stringified = JSON.stringify(value)

  if (settingDetails[key].cache)
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
  let value: any = null
  if (settingDetails[key].cache) value = await redis.get(redisSettingKey(key))

  if (value === null) {
    const data = await dbClient.setting.findUnique({ where: { key } })
    if (!data) return null

    if (settingDetails[key].cache)
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
    description: settingDetails[key as SettingKeys].description,
  }))

  result.push(
    ...Object.entries(SettingList)
      .filter(([item]) => !values.find((v) => v.key === item))
      .map(([key, value]) => ({
        key: key as SettingKeys,
        type: value.toString(),
        description: settingDetails[key as SettingKeys].description,
        value: null,
      })),
  )

  return result
}
