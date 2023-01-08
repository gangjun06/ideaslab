import { ChannelType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { ignoreError } from '~/utils'

export default new Event('messageUpdate', async (client, message) => {
  if (message.channel.type !== ChannelType.PublicThread) return
  if (!message.channel.parentId) return
  if (message.channel.parent?.type !== ChannelType.GuildForum) return

  if (!message.content) return

  try {
    // Update Comment
    await dbClient.comment.update({
      where: {
        discordId: message.id,
      },
      data: {
        content: message.content,
      },
    })
  } catch {
    // Update Gallery Post
    await ignoreError(
      dbClient.post.update({
        where: {
          discordId: message.channel.id,
        },
        data: {
          content: message.content,
        },
      }),
    )
  }
})
