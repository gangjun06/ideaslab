import { ChannelType } from 'discord.js'

import { Button } from '~/bot/base/interaction'
import { voiceChannelClaim } from '~/service/voice-channel'
import { Embed } from '~/utils/embed'

export default new Button(['voice-claim'], async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return

  const success = await voiceChannelClaim(interaction.channel, interaction.member)
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
  //   await interaction.reply({
  //     embeds: [new Embed(client, 'success').setTitle('이제 음성채팅방을 관리할 수 있습니다.')],
  //     ephemeral: true,
  //   })
  await interaction.channel?.send({
    embeds: [
      new Embed(client, 'success').setTitle(
        `채널 관리자가 \`${interaction.member.displayName}\`님 으로 변경되었어요.`,
      ),
    ],
  })
})
