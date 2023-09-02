import { ChannelType } from 'discord.js'

import { Modal } from '~/bot/base/interaction'
import { redis } from '~/lib/redis'
import {
  findChatroomRule,
  redisVoiceRenameRateExpire,
  voiceChannelState,
} from '~/service/voice-channel'
import { redisVoiceRenameRateKey } from '~/service/voice-channel'
import { Embed } from '~/utils/embed'

export default new Modal('modal.voice-rename', async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return
  let newName = interaction.fields.getTextInputValue('nameInput')

  if (newName === '') {
    newName = `${interaction.member.displayName}님의 채널`
  }

  if (newName.length === 1) {
    await interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('채널 이름은 한 글자로 설정할 수 없어요.')],
      ephemeral: true,
    })
    return
  }

  const { data } = await voiceChannelState(interaction.channel)

  try {
    const rule = findChatroomRule(data.ruleId)
    await interaction.channel.setName(`[${rule?.emoji} ${rule?.name}] ${newName}`)
  } catch {
    await interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('채널 이름 설정에 실패했어요.')],
      ephemeral: true,
    })
    return
  }

  await interaction.deferUpdate({})

  await redis.set(
    redisVoiceRenameRateKey(interaction.channel.id),
    '1',
    'EX',
    redisVoiceRenameRateExpire,
  )

  await interaction.channel?.send({
    embeds: [
      new Embed(client, 'success').setTitle(`채널 이름이 \`${newName}\` 으로 변경되었어요.`),
    ],
  })
})
