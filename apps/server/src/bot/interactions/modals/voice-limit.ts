import { ChannelType } from 'discord.js'

import { Modal } from '~/bot/base/interaction'
import { Embed } from '~/utils/embed'

export default new Modal('modal.voice-limit', async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return

  let limit = interaction.fields.getTextInputValue('limitInput')

  if (limit === '') {
    limit = '0'
  }

  if (isNaN(limit as any)) {
    interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('숫자만 입력할 수 있어요.')],
      ephemeral: true,
    })
    return
  }

  try {
    await interaction.channel.setUserLimit(parseInt(limit))
  } catch {
    interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('인원제한 설정에 실패했어요.')],
      ephemeral: true,
    })
  }

  interaction.deferUpdate({})

  if (limit === '0') {
    interaction.channel.send({
      embeds: [new Embed(client, 'success').setTitle('채널의 인원제한을 지웠어요.')],
    })
    return
  }

  interaction.channel.send({
    embeds: [new Embed(client, 'success').setTitle(`채널의 인원제한을 ${limit}로 수정했어요.`)],
  })
})
