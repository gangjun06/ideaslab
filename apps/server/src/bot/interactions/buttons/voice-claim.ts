import { ChannelType } from 'discord.js'

import { currentGuildMember } from '~/bot/base/client'
import { Button } from '~/bot/base/interaction'
import { voiceChannelClaim } from '~/service/voice-channel'
import { Embed } from '~/utils/embed'

export default new Button(['voice-claim'], async (client, interaction) => {
  if (
    !interaction.channel ||
    interaction.channel.type !== ChannelType.GuildVoice ||
    !interaction.member
  )
    return

  if (!interaction.channel.members.get(interaction.user.id)) {
    await interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('채널에 먼저 접속하여 주세요.')],
      ephemeral: true,
    })
    return false
  }

  const success = await voiceChannelClaim(interaction.channel, interaction.user.id)
  if (!success) {
    await interaction.reply({
      embeds: [
        new Embed(client, 'error').setTitle(
          '채널 관리자가 음성채팅방 내에 있어서 권한을 받지 못하였어요.',
        ),
      ],
      ephemeral: true,
    })
    return
  }
  await interaction.deferUpdate()

  const member = await currentGuildMember(interaction.user.id)

  await interaction.channel?.send({
    embeds: [
      new Embed(client, 'success').setTitle(
        `채널 관리자가 \`${member.displayName}\`님 으로 변경되었어요.`,
      ),
    ],
  })
})
