import { ChannelType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { ignoreError } from '~/utils'

export default new Event('threadUpdate', async (client, threadChannel) => {
  if (threadChannel.parent?.type !== ChannelType.GuildForum) return
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
