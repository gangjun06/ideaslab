import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

import { SlashCommand } from '~/bot/base/command'
import { voiceRuleSettingMessageContent } from '~/service/voice-channel/builder'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('음성생성-전송')
    .setDescription('[관리자용] 음성채팅방을 생성하는 메시지를 전송해요.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (client, interaction) => {
    interaction.reply({ content: '인증 메시지를 전송했어요.', ephemeral: true })

    try {
      const { embeds, components } = voiceRuleSettingMessageContent({
        client,
        selected: '0',
        forCreate: true,
        customRule: '',
      })

      await interaction.channel?.send({ embeds, components })
    } catch (error) {
      console.error(error)
    }
  },
)
