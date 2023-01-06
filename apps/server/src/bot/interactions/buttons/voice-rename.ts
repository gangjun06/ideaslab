import {
  ActionRowBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'

import { Button } from '~/bot/base/interaction'
import { voiceChannelOwnerCheck } from '~/service/voice-channel'

export default new Button(['voice-rename'], async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return
  if (!(await voiceChannelOwnerCheck(interaction))) return

  const modal = new ModalBuilder().setCustomId('modal.voice-rename').setTitle('음성채널 이름 변경')

  const favoriteColorInput = new TextInputBuilder()
    .setCustomId('nameInput')
    .setLabel('변경할 이름을 입력해 주세요.')
    .setValue(interaction.channel.name.replace(/^\[비공개\] /, ''))
    .setPlaceholder(`${interaction.member.displayName}님의 채널`)
    .setMaxLength(32)
    .setStyle(TextInputStyle.Short)

  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput)

  modal.addComponents(firstActionRow)

  await interaction.showModal(modal)
})
