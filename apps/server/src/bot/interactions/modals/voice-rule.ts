import { ChannelType } from 'discord.js'

import { Modal } from '~/bot/base/interaction'
import { voiceChannelSetDescription } from '~/service/voice-channel'
import { Embed } from '~/utils/embed'

export default new Modal('modal.voice-rule', async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return
  let newName = interaction.fields.getTextInputValue('ruleInput')

  if (newName === '') {
    newName = ``
  }

  await interaction.deferUpdate({})

  try {
    voiceChannelSetDescription(interaction.channel, newName)
  } catch {
    await interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('채널 규칙 설정에 실패했어요.')],
      ephemeral: true,
    })
    return
  }

  await interaction.channel?.send({
    embeds: [
      new Embed(client, 'success').setTitle(`채널 규칙이 변경되었어요.`).addFields({
        name: '규칙',
        value: newName,
      }),
    ],
  })
})
