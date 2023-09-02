import { ChannelType } from 'discord.js'

import { Modal } from '~/bot/base/interaction'
import {
  findChatroomRule,
  voiceChannelSetRule,
  voiceRuleSettingMessageContent,
} from '~/service/voice-channel'
import { Embed } from '~/utils/embed'

export default new Modal('modal.voice-rule-edit', async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return

  const ruleId = interaction.customId.split(':')[1]

  const newRule = interaction.fields.getTextInputValue('ruleInput')

  await interaction.deferUpdate({})

  try {
    const prevRule = await voiceChannelSetRule(interaction.channel.id, newRule)
    const prevRuleDetail = findChatroomRule(prevRule.ruleId)
    const newRuleDetail = findChatroomRule(ruleId)

    const { components, embeds } = voiceRuleSettingMessageContent({
      client,
      customRule: newRule,
      forCreate: false,
      selected: newRule,
    })
    await interaction.editReply({ components, embeds })

    await interaction.channel?.send({
      embeds: [
        new Embed(client, 'success').setTitle(`채널 규칙이 변경되었어요.`).setDescription(
          `**이전 규칙:**\n[${prevRuleDetail?.emoji} ${prevRuleDetail?.name}] ${prevRule.customRule}\n-->
**새 규칙**:\n[${newRuleDetail?.emoji} ${newRuleDetail?.name}] ${newRule}`,
        ),
      ],
    })
  } catch {
    await interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('채널 규칙 설정에 실패했어요.')],
      ephemeral: true,
    })
    return
  }
})
