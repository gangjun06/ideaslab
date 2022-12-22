import { dbClient, prisma } from '@ideaslab/db'
import { ChannelType } from 'discord.js'
import { Event } from '~/bot/event'

export default new Event('messageCreate', async (client, message) => {
  if (message.channel.type !== ChannelType.PublicThread) return
  if (!message.channel.parentId) return
  if (message.channel.parent?.type !== ChannelType.GuildForum) return

  message.reference?.messageId

  const post = await dbClient.post.findUnique({
    where: { discordId: message.channelId },
    select: { id: true },
  })
  if (!post) return

  await dbClient.comment.create({
    data: {
      authorId: message.author.id,
      content: message.content,
      discordId: message.id,
      parentId: message.reference?.messageId,
      postId: post.id,
    },
  })
})
