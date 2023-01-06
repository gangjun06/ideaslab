import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { ContextMenu } from '~/bot/base/interaction'
import { Embed } from '~/utils/embed'

export default new ContextMenu(
  ApplicationCommandType.User,
  new ContextMenuCommandBuilder().setName('자기소개-확인하기'),
  async (client, interaction) => {
    const { targetMember } = interaction

    const user = await dbClient.user.findFirst({ where: { discordId: targetMember.id } })
    if (!user) {
      const embed = new Embed(client, 'error')
        .setTitle('자기소개 검색에 실패했어요')
        .setDescription(
          '유저가 가입되지 않은 상태이거나 봇에 문제가 있는 것 같아요.\n잠시 후 다시 시도해주세요.',
        )
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      })
      return
    }

    const embed = new Embed(client, 'info')
      .setDescription('검색한 유저에 대한 정보입니다')
      .addFields({
        name: '자기소개',
        value: `${user.introduce}`,
      })
      .setAuthor({
        name: targetMember.displayName,
        iconURL: targetMember.displayAvatarURL(),
        url: `https://ideaslab.kr/@${user.handle}`,
      })

    if (user.links.length > 0) {
      embed.addFields({
        name: '링크',
        value: user.links.map(({ name, url }: any) => `[${name}](${url})`).join(' '),
      })
    }

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    })
  },
)
