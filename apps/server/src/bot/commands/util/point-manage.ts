import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

import { SlashCommand } from '~/bot/base/command'
import { pointService } from '~/service/point'
import { Embed } from '~/utils/embed'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('포인트관리')
    .setDescription('다른 사람들의 포인트를 관리해요.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('확인')
        .setDescription('유저의 포인트를 확인해요.')
        .addUserOption((option) =>
          option.setName('유저').setDescription('확인할 유저를 선택해주세요.').setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('변경')
        .setDescription('유저의 포인트를 변경해요.')
        .addUserOption((option) =>
          option.setName('유저').setDescription('확인할 유저를 선택해주세요.').setRequired(true),
        )
        .addNumberOption((option) =>
          option
            .setName('포인트')
            .setDescription('변경할 포인트를 입력해주세요.')
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName('이유')
            .setDescription('포인트 변경 이유를 입력해주세요.')
            .setRequired(true),
        ),
    ),
  async (client, interaction) => {
    const subCommand = interaction.options.getSubcommand()
    const targetUser = interaction.options.getUser('유저', true)

    if (subCommand === '확인') {
      const point = (await pointService.get(targetUser.id))._sum.value ?? 0
      const embed = new Embed(client, 'info')
        .setTitle(`${targetUser.username}님의 포인트`)
        .setDescription(`${targetUser.username}님의 포인트는 ${point}에요.`)
      interaction.reply({ embeds: [embed], ephemeral: true })

      return
    }

    if (subCommand === '변경') {
      const reason = interaction.options.getString('이유', true)
      const point = interaction.options.getNumber('포인트', true)
      const prevPoint = (await pointService.get(targetUser.id))._sum.value ?? 0
      await pointService.manual(targetUser.id, point, reason)

      const embed = new Embed(client, 'success')
        .setTitle('포인트 변경')
        .setDescription(
          `${targetUser.username}의 포인트를 ${prevPoint}에서 ${
            prevPoint + point
          }로 변경했어요.\n이유: ${reason}`,
        )
      interaction.reply({ embeds: [embed], ephemeral: true })
      return
    }

    interaction.reply({ content: '', ephemeral: true })
  },
)
