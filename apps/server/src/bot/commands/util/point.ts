import { SlashCommandBuilder } from 'discord.js'

import { SlashCommand } from '~/bot/base/command'
import { pointService } from '~/service/point'
import { Embed } from '~/utils/embed'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('이벤트')
    .setDescription('얻은 포인트를 확인해요.')
    .addSubcommand((command) => command.setName('포인트').setDescription('내 포인트를 확인해요.'))
    .addSubcommand((command) => command.setName('랭킹').setDescription('이벤트 랭킹을 확인해요.')),
  async (client, interaction) => {
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === '포인트') {
      const { user } = interaction

      const point = (await pointService.get(user.id))._sum.value ?? 0
      const rank = await pointService.rankUser(user.id)

      const embed = new Embed(client, 'info')
        .setTitle(`${user.username}님의 포인트`)
        .setDescription(
          `<@${user.id}>님의 포인트는 **${point}**점 이에요.\n현재 랭킹은 상위 **${rank.percent}%** 이내에 있어요!`,
        )

      interaction.reply({ embeds: [embed], ephemeral: true })
    } else if (subcommand === '랭킹') {
      const ranking = (await pointService.rank()).map((item, index) => ({
        name: `${index + 1}위`,
        value: `<@${item.userId}> - ${item.value}점`,
      }))
      const embed = new Embed(client, 'info')
        .setTitle(`이벤트 랭킹`)
        .setDescription(`누가 가장 많은 포인트를 얻었을까요?`)
        .addFields(ranking)

      interaction.reply({ embeds: [embed] })
    }

    return
  },
)
