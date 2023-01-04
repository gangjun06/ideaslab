import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'

import { ChannelType } from 'discord.js'

export default new Event('messageUpdate', async (client, message) => {
  if (message.channel.type !== ChannelType.PublicThread) return
  if (!message.channel.parentId) return
  if (message.channel.parent?.type !== ChannelType.GuildForum) return

  if (!message.content) return

  await dbClient.comment.update({
    where: {
      discordId: message.id,
    },
    data: {
      content: message.content,
    },
  })
})
