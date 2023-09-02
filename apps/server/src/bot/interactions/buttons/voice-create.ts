import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

import { Button } from '~/bot/base/interaction'
import { chatroomList } from '~/service/voice-channel/constants'

export default new Button('create-voice', async (client, interaction) => {
  const ruleId = interaction.customId.split('-')[2]

  const rule = chatroomList.find((chatroom) => chatroom.id === ruleId)

  const modal = new ModalBuilder()
    .setCustomId(`modal.voice-create:${ruleId}`)
    .setTitle(`음성채널 생성 - ${rule?.name}`)

  const favoriteColorInput = new TextInputBuilder()
    .setCustomId('nameInput')
    .setLabel('음성채팅방 이름을 입력해 주세요.')
    .setPlaceholder(`월요일 게임방`)
    .setMinLength(1)
    .setRequired(true)
    .setMaxLength(32)
    .setStyle(TextInputStyle.Short)

  const customRuleInput = new TextInputBuilder()
    .setCustomId('ruleInput')
    .setLabel('음성채팅방 규칙 커스텀')
    .setPlaceholder('규칙을 입력해주세요.')
    .setMinLength(1)
    .setRequired(true)
    .setMaxLength(100)
    .setStyle(TextInputStyle.Paragraph)
    .setValue(`${rule?.description}\n${rule?.rule}`)

  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput)
  const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(customRuleInput)

  modal.addComponents(firstActionRow, secondActionRow)

  await interaction.showModal(modal)
})
