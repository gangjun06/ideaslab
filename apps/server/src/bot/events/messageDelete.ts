import { ChannelType } from 'discord.js'

import { Event } from '~/bot/base/event'
import { dbClient } from '~/lib/db'

export default new Event('messageDelete', async (client, message) => {
  if (message.channel.type !== ChannelType.PublicThread) return
  if (!message.channel.parentId) return
  if (message.channel.parent?.type !== ChannelType.GuildForum) return

  await dbClient.comment.delete({
    where: {
      discordId: message.id,
    },
  })
})
