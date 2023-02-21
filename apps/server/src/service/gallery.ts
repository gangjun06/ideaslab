import { dbClient } from '@ideaslab/db'

import config from '~/config'
import { redis } from '~/lib/redis'

const redisGalleryCategoryKey = (channelId: string) => `${config.redisPrefix}gallery:${channelId}`

const redisExpire = 60 * 60 * 24 // 24 hours

/**
 * Get gallery category id from channel id
 * @param {string} channelId
 * @returns galleryId
 * @example
 * const categoryId = await getGalleryCategory(channel.id)
 * if (!categoryId) return
 */
export const getGalleryCategory = async (channelId: string) => {
  const cached = await redis.get(redisGalleryCategoryKey(channelId))
  if (cached) return parseInt(cached)

  const category = await dbClient.category.findUnique({
    where: {
      discordChannel: channelId,
    },
    select: {
      id: true,
    },
  })

  if (!category) return null

  await redis.set(redisGalleryCategoryKey(channelId), category.id, 'EX', redisExpire)

  return category.id
}
