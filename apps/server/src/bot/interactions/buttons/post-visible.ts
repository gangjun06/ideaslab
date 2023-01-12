import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from 'discord.js'

import { dbClient, DefaultVisible } from '@ideaslab/db'

import { Button } from '~/bot/base/interaction'
import config from '~/config'
import { Embed } from '~/utils/embed'

export default new Button(['post-visible'], async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.PublicThread) return

  interaction.deferReply({ ephemeral: true })

  const post = await dbClient.post.findUnique({
    where: { discordId: interaction.channel.id },
    select: {
      id: true,
      visible: true,
      authorId: true,
    },
  })
  if (!post) return

  if (post.authorId !== interaction.user.id) {
    await interaction.reply('게시글 작성자만 설정할 수 있어요.')
    return
  }

  await dbClient.post.update({
    where: {
      id: post.id,
    },
    data: {
      visible:
        post.visible === DefaultVisible.MemberOnly
          ? DefaultVisible.Public
          : DefaultVisible.MemberOnly,
    },
  })

  const visibleButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel(`공개 설정: ${post.visible === DefaultVisible.MemberOnly ? '공개' : '맴버 공개'}`)
    .setCustomId('post-visible')

  const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel('웹에서 보기')
    .setURL(`${config.webURL}/gallery/${post.id}`)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(visibleButton, button)

  await interaction.message.edit({ components: [row] })

  await interaction.editReply({
    embeds: [
      new Embed(client, 'success')
        .setTitle(
          `공개설정이 성공적으로 \`${
            post.visible === DefaultVisible.MemberOnly ? '공개' : '맴버 공개'
          }\`로 변경되었어요.`,
        )
        .setDescription(
          '맴버 공개: 아이디어스 랩 맴버만 게시글을 확인할 수 있어요.\n공개: 모든 사람이 아이디어스 랩 웹사이트를 통해 게시글을 확인할 수 있어요.',
        ),
    ],
  })
})
