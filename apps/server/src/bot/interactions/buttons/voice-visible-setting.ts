import { ChannelType } from 'discord.js'

import { Button } from '~/bot/base/interaction'
import {
  voiceChannelAllow,
  voiceChannelVisible,
  voiceChannelVisibleState,
} from '~/service/voice-channel'
import { Embed } from '~/utils/embed'

import { visibleSettingMessageContent } from './voice-visible'

export default new Button(['voice-visible-setting'], async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return

  await interaction.deferUpdate()

  const { isPrivate, members } = await voiceChannelVisibleState(interaction.channel)

  const { embed, row } = visibleSettingMessageContent(client, !isPrivate, members)

  try {
    await interaction.editReply({ embeds: [embed], components: [row] })
  } catch (e) {
    /* empty */
  }

  await voiceChannelVisible(interaction.channel, !isPrivate)

  if (!isPrivate) {
    await voiceChannelAllow(interaction.channel, interaction.member.id)
  }

  await interaction.channel?.send({
    embeds: [
      new Embed(client, 'success').setTitle(
        `채널을 \`${isPrivate ? '공개' : '비공개'}\`로 설정하였어요.`,
      ),
    ],
  })
})
