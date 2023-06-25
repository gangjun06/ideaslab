import { SlashCommandBuilder } from 'discord.js'

import { SlashCommand } from '~/bot/base/command'
import { pointService } from '~/service/point'
import { Embed } from '~/utils/embed'

export default new SlashCommand(
  new SlashCommandBuilder().setName('포인트').setDescription('얻은 포인트를 확인해요.'),
  async (client, interaction) => {
    const { user } = interaction

    const point = (await pointService.get(user.id))._sum.value ?? 0
    const embed = new Embed(client, 'info')
      .setTitle(`${user.username}님의 포인트`)
      .setDescription(`${user.username}님의 포인트는 ${point}에요.`)

    interaction.reply({ embeds: [embed], ephemeral: true })

    return
  },
)
