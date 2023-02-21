import { Event } from '~/bot/base/event'

export default new Event('threadCreate', async (_client, _threadChannel, _newly) => {
  // if (!newly) return
  // if (!threadChannel.parentId || !threadChannel.ownerId) return
  // if (!threadChannel.parent || threadChannel.parent.type !== ChannelType.GuildForum) return
  // const tags = threadChannel.parent.availableTags
  // const messages = await threadChannel.messages.fetch({ limit: 1, cache: false })
  // const message = messages.first()
  // if (!message) return
  // const category = await getGalleryCategory(threadChannel.parentId)
  // if (!category) return
  // const user = await dbClient.user.findUnique({
  //   where: { discordId: threadChannel.ownerId },
  //   select: {
  //     defaultVisible: true,
  //   },
  // })
  // if (!user) return
  // const attachments = message.attachments.map((attachment) => {
  //   return {
  //     url: attachment.url,
  //     name: attachment.name,
  //     contentType: attachment.contentType,
  //     size: attachment.size,
  //     width: attachment.width,
  //     height: attachment.height,
  //     spoiler: attachment.spoiler,
  //   }
  // })
  // const postTags: string[] = []
  // threadChannel.appliedTags.forEach((tagId) => {
  //   const target = tags.find(({ id }) => id === tagId)
  //   if (!target) return
  //   postTags.push(target.name.replace(/ /g, '_'))
  // })
  // try {
  //   const postData = await dbClient.post.create({
  //     data: {
  //       discordId: threadChannel.id,
  //       categoryId: category.id,
  //       authorId: threadChannel.ownerId,
  //       content: message.content ?? '',
  //       title: threadChannel.name,
  //       attachments: attachments as unknown as Prisma.JsonArray,
  //       visible: user.defaultVisible,
  //       tags: {
  //         connectOrCreate: postTags.map((tag) => ({
  //           where: { name: tag },
  //           create: {
  //             name: tag,
  //           },
  //         })),
  //       },
  //     },
  //   })
  //   const visibleButton = new ButtonBuilder()
  //     .setStyle(ButtonStyle.Secondary)
  //     .setLabel(
  //       `공개 설정: ${user.defaultVisible === DefaultVisible.Public ? '공개' : '맴버 공개'}`,
  //     )
  //     .setCustomId('post-visible')
  //   const button = new ButtonBuilder()
  //     .setStyle(ButtonStyle.Link)
  //     .setLabel('웹에서 보기')
  //     .setURL(`${config.webURL}/gallery/${postData.id}`)
  //   const row = new ActionRowBuilder<ButtonBuilder>().addComponents(visibleButton, button)
  //   await threadChannel.send({
  //     components: [row],
  //   })
  // } catch (e) {
  //   console.error(e)
  // }
})
