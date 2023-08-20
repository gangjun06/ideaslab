import {
  ActionRowBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'

import { Button } from '~/bot/base/interaction'
import { voiceChannelOwnerCheck, voiceChannelState } from '~/service/voice-channel'

export default new Button(['voice-rule'], async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return
  if (!(await voiceChannelOwnerCheck(interaction))) return

  const modal = new ModalBuilder().setCustomId('modal.voice-rule').setTitle('음성채팅방 규칙 변경')

  const { rule } = await voiceChannelState(interaction.channel)

  const favoriteColorInput = new TextInputBuilder()
    .setCustomId('ruleInput')
    .setLabel('변경할 규칙을 입력해 주세요.')
    .setValue(rule)
    .setPlaceholder(`예시: 게임 O, 큰 소리 X, 작업 이외의 화공 X ...`)
    .setStyle(TextInputStyle.Paragraph)

  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput)

  modal.addComponents(firstActionRow)

  await interaction.showModal(modal)
})
