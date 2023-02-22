import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

import { SlashCommand } from '~/bot/base/command'
import { notVerifiedUsers } from '~/service/auth'
import { Embed } from '~/utils/embed'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('인증안된-사용자')
    .setDescription(
      '[관리자용] 아이디어스랩에 가입한 후 인증을 완료하지 않은 사용자의 목록을 보여줘요.',
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true })
    const list = await notVerifiedUsers()

    const text = list
      .map(
        (member) =>
          `${member.displayName} | ${member.id} | <t:${Math.ceil(
            (member?.joinedTimestamp ?? 0) / 1000,
          )}:R>`,
      )
      .join('\n')

    const embed = new Embed(client, 'info')
      .setTitle('인증안된 사용자의 목록')
      .setDescription(text.length > 0 ? text : '모든 유저가 가입을 완료한 상태입니다!')

    await interaction.editReply({ embeds: [embed] })
  },
)
