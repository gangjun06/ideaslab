import {
  ActionRowBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'

import { currentGuildMember } from '~/bot/base/client'
import { Button } from '~/bot/base/interaction'
import { redis } from '~/lib/redis'
import { redisVoiceRenameRateKey, voiceChannelOwnerCheck } from '~/service/voice-channel'
import { formatSeconds } from '~/service/voice-log'

export default new Button(['voice-rename'], async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return
  if (!(await voiceChannelOwnerCheck(interaction))) return

  const timeLeft = await redis.pttl(redisVoiceRenameRateKey(interaction.channelId))
  if (timeLeft > 0) {
    await interaction.reply({
      content: `5분마다 한번씩 이름을 변경할 수 있어요. (남은시간: ${formatSeconds(
        Math.round(timeLeft / 1000),
      )}) `,
      ephemeral: true,
    })
    return
  }

  const modal = new ModalBuilder().setCustomId('modal.voice-rename').setTitle('음성채널 이름 변경')

  const member = await currentGuildMember(interaction.user.id)

  const favoriteColorInput = new TextInputBuilder()
    .setCustomId('nameInput')
    .setLabel('변경할 이름을 입력해 주세요.')
    .setValue(interaction.channel.name.replace(/^\[비공개\] /, ''))
    .setPlaceholder(`${member.displayName}님의 채널`)
    .setMaxLength(32)
    .setStyle(TextInputStyle.Short)

  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput)

  modal.addComponents(firstActionRow)

  await interaction.showModal(modal)
})
