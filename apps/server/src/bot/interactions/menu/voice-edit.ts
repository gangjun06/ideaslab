import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

import { SelectMenu } from '~/bot/base/interaction'
import { chatroomList } from '~/service/voice-channel/constants'

export default new SelectMenu('string', 'menu.voice-rule-edit', async (client, interaction) => {
  if (!interaction.channel) return

  const ruleId = interaction.values[0]

  const rule = chatroomList.find((chatroom) => chatroom.id === ruleId)

  const modal = new ModalBuilder()
    .setCustomId(`modal.voice-rule-edit:${ruleId}`)
    .setTitle(`음성채널 생성 - ${rule?.name}`)

  const customRuleInput = new TextInputBuilder()
    .setCustomId('ruleInput')
    .setLabel('음성채팅방 규칙 커스텀')
    .setPlaceholder('바꿀 규칙을 입력해주세요.')
    .setMinLength(1)
    .setRequired(true)
    .setMaxLength(100)
    .setStyle(TextInputStyle.Paragraph)
    .setValue(`${rule?.description}\n${rule?.rule}`)

  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(customRuleInput)

  modal.addComponents(firstActionRow)

  await interaction.showModal(modal)
})
