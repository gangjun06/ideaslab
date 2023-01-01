import { Event } from '~/bot/base/event'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, TextChannel } from 'discord.js'
import { Embed } from '~/utils/embed'
import { dbClient, prisma, Prisma } from '@ideaslab/db'
import { currentGuild } from '~/bot/base/client'

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

  await dbClient.$transaction([deleteComments, deletePost])
})
