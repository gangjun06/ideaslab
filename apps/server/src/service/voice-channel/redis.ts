import config from '~/config'
import { redis } from '~/lib/redis'

import { VoiceData } from './types.js'

export const redisVoiceOwnerKey = (key: string) => `${config.redisPrefix}voice:${key}`
export const redisVoiceOwnerExpire = 60 * 60 * 24 * 14

export const redisVoiceDataKey = (key: string) => `${config.redisPrefix}voice-data:${key}`
export const redisVoiceDataKeyExpire = 60 * 60 * 24 * 14

export const redisVoiceRenameRateKey = (key: string) =>
  `${config.redisPrefix}voice-rename-rate:${key}`
export const redisVoiceRenameRateExpire = 60 * 5

export const delVoiceOwner = async (channelId: string) => redis.del(redisVoiceOwnerKey(channelId))

export const getDelVoiceOwner = async (channelId: string) =>
  redis.getdel(redisVoiceOwnerKey(channelId))

export const getVoiceOwner = async (channelId: string) => redis.get(redisVoiceOwnerKey(channelId))

export const setVoiceOwner = (channelId: string, memberId: string) =>
  redis.set(redisVoiceOwnerKey(channelId), memberId, 'EX', redisVoiceOwnerExpire)

export const getVoiceData = async (channelId: string) =>
  JSON.parse((await redis.get(redisVoiceDataKey(channelId))) ?? '{}') as VoiceData

export const setVoiceData = (channelId: string, data: VoiceData) =>
  redis.set(redisVoiceDataKey(channelId), JSON.stringify(data), 'EX', redisVoiceDataKeyExpire)

export const delVoiceData = async (channelId: string) => redis.del(redisVoiceDataKey(channelId))
