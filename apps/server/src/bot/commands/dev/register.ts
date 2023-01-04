import { SlashCommandBuilder } from 'discord.js'

import { SlashCommand } from '~/bot/base/command'

export default new SlashCommand(
  new SlashCommandBuilder().setName('명령어등록').setDescription('명령어를 업데이트 합니다.'),
  async (client, interaction) => {
    if (interaction.guildId === null) return interaction.reply('오류가 발생하였어요.')

    try {
      await client.command.slashCommandSetup(interaction.guildId as string)
      interaction.reply('성공적으로 명령어를 등록했어요')
    } catch (e) {
      client.error.report(e as any)
    }
  },
)
