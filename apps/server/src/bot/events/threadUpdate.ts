import { Channel, ChannelType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { ignoreError } from '~/utils'

import { currentGuildChannel } from '../base/client'

export default new Event('threadUpdate', async (client, _oldThreadChannel, threadChannel) => {
  if (!threadChannel.parentId) return

  let parent: Channel | null = threadChannel.parent
  if (!threadChannel.parent) {
    parent = await currentGuildChannel(threadChannel.parentId)
  }

  if (parent?.type !== ChannelType.GuildForum) return
  if (threadChannel.type !== ChannelType.PublicThread) return

  // Update post title
  await ignoreError(
    dbClient.post.update({
      where: {
        discordId: threadChannel.id,
      },
      data: {
        title: threadChannel.name,
      },
    }),
  )
})
