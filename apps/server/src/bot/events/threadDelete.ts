import { ChannelType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { ignoreError } from '~/utils'

export default new Event('threadDelete', async (client, threadChannel) => {
  if (threadChannel.parent?.type !== ChannelType.GuildForum) return

  const deletePost = dbClient.post.delete({
    where: {
      discordId: threadChannel.id,
    },
  })
  const deleteComments = dbClient.comment.deleteMany({
    where: { parent: { discordId: threadChannel.id } },
  })

  await ignoreError(dbClient.$transaction([deleteComments, deletePost]))
})
