import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '~/bot/command'

export default new SlashCommand(
  new SlashCommandBuilder().setName('로그인').setDescription('로그인에 관한 설명.'),
  async (client, interaction) => {
    interaction.reply('HELLO!')
  },
)
