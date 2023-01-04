import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from 'discord.js'

import { dbClient, Prisma } from '@ideaslab/db'

import { Event } from '~/bot/base/event'

export default new Event('threadCreate', async (client, threadChannel, newly) => {
  if (!newly) return
  if (!threadChannel.parentId || !threadChannel.ownerId) return

  if (!threadChannel.parent || threadChannel.parent.type !== ChannelType.GuildForum) return

  const tags = threadChannel.parent.availableTags

  const messages = await threadChannel.messages.fetch({ limit: 1, cache: false })
  const message = messages.first()
  if (!message) return

  const category = await dbClient.category.findUnique({
    where: { discordChannel: threadChannel.parentId },
  })
  if (!category) return

  const attachments = message.attachments.map((attachment) => {
    return {
      url: attachment.url,
      name: attachment.name,
      contentType: attachment.contentType,
      size: attachment.size,
      width: attachment.width,
      height: attachment.height,
      spoiler: attachment.spoiler,
    }
  })

  const postTags: string[] = []
  threadChannel.appliedTags.forEach((tagId) => {
    const target = tags.find(({ id }) => id === tagId)
    if (!target) return
    postTags.push(target.name.replace(/ /g, '_'))
  })

  try {
    await dbClient.post.create({
      data: {
        discordId: threadChannel.id,
        categoryId: category.id,
        authorId: threadChannel.ownerId,
        content: message.content ?? '',
        title: threadChannel.name,
        attachments: attachments as unknown as Prisma.JsonArray,
        tags: {
          connectOrCreate: postTags.map((tag) => ({
            where: { name: tag },
            create: {
              name: tag,
            },
          })),
        },
      },
    })
  } catch (e) {
    console.error(e)
  }

  // const embed = new Embed(client, 'success').
  const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel('웹에서 보기')
    .setURL('https://google.com')

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

  threadChannel.send({
    components: [row],
  })
})
