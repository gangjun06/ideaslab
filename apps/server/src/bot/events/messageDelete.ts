import { ChannelType, MessageType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { ignoreError } from '~/utils'

export default new Event('messageDelete', async (client, message) => {
  if (message.channel.type !== ChannelType.PublicThread) return
  if (!message.channel.parentId) return
  if (message.channel.parent?.type !== ChannelType.GuildForum) return
  if (message.type !== MessageType.Default && message.type !== MessageType.Reply) return
  if (message.author.bot) return

  await ignoreError(
    dbClient.comment.delete({
      where: {
        discordId: message.id,
      },
    }),
  )
})
