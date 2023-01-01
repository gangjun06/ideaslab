import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js'
import { SlashCommand } from '~/bot/base/command'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('인증메시지-전송')
    .setDescription('[관리자용] 아이디어스랩 웹사이트에 연결되는 인증 메시지를 전송해요.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (client, interaction) => {
    interaction.reply({ content: '인증 메시지를 전송했어요.', ephemeral: true })

    const button = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('가입 완료하기')
      .setCustomId('register-complete')

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

    interaction.channel?.send({ components: [row] })
  },
)
