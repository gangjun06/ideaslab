import { ChannelType, MessageType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { ignoreError } from '~/utils'

export default new Event('messageCreate', async (client, message) => {
  if (message.channel.type !== ChannelType.PublicThread) return
  if (!message.channel.parentId) return
  if (message.channel.parent?.type !== ChannelType.GuildForum) return
  if (message.type !== MessageType.Default && message.type !== MessageType.Reply) return
  if (message.author.bot) return

  const post = await dbClient.post.findUnique({
    where: { discordId: message.channelId },
    select: { id: true },
  })
  if (!post) return

  const parentId = message.reference?.messageId
  await ignoreError(
    dbClient.comment.create({
      data: {
        authorId: message.author.id,
        content: message.content,
        discordId: message.id,
        postId: post.id,
        parentId,
        hasParent: !!parentId,
      },
    }),
  )
})
