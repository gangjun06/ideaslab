import { dbClient, prisma } from '@ideaslab/db'
import { ChannelType } from 'discord.js'
import { Event } from '~/bot/base/event'

export default new Event('messageCreate', async (client, message) => {
  if (message.channel.type !== ChannelType.PublicThread) return
  if (!message.channel.parentId) return
  if (message.channel.parent?.type !== ChannelType.GuildForum) return

  const post = await dbClient.post.findUnique({
    where: { discordId: message.channelId },
    select: { id: true },
  })
  if (!post) return

  try {
    const parentId = message.reference?.messageId
    await dbClient.comment.create({
      data: {
        authorId: message.author.id,
        content: message.content,
        discordId: message.id,
        postId: post.id,
        parentId,
        hasParent: !!parentId,
      },
    })
  } catch (e) {
    console.error(e)
  }
})
