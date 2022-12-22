import { dbClient, prisma } from '@ideaslab/db'
import { ChannelType } from 'discord.js'
import { Event } from '~/bot/event'

export default new Event('messageUpdate', async (client, message) => {
  console.log(message)
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
