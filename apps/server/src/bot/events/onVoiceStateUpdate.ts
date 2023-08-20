import { GuildMember, TextBasedChannel, VoiceChannel } from 'discord.js'

import { Event } from '~/bot/base/event'
import { getSetting } from '~/service/setting'
import { voiceChannelCreate, voiceChannelDelete, voiceChannelState } from '~/service/voice-channel'
import { eventMemberJoin, eventMemberLeave } from '~/service/voice-log'
import { Embed } from '~/utils/embed'

const sendAlert = async (
  channel: TextBasedChannel,
  type: 'join' | 'leave',
  member?: GuildMember | null,
) => {
  const { rule } = await voiceChannelState(channel as VoiceChannel)
  if (type === 'join' && rule) {
    await channel.send({
      content: `<@${member?.user.id}>`,
      embeds: [
        new Embed(channel.client, type === 'join' ? 'info' : 'error')
          .setTitle(
            type === 'join' ? '맴버가 음성채팅방에 들어왔어요.' : '맴버가 음성채팅방에서 나갔어요.',
          )
          .setAuthor({
            name: member?.displayName ?? '알 수 없음',
            iconURL: member?.user.displayAvatarURL(),
          })
          .setDescription(`**아래의 규칙을 지켜주세요**:\n\`\`\`\n${rule}\n\`\`\``),
      ],
    })
    return
  }
  await channel.send({
    embeds: [
      new Embed(channel.client, type === 'join' ? 'info' : 'error')
        .setTitle(
          type === 'join' ? '맴버가 음성채팅방에 들어왔어요.' : '맴버가 음성채팅방에서 나갔어요.',
        )
        .setAuthor({
          name: member?.displayName ?? '알 수 없음',
          iconURL: member?.user.displayAvatarURL(),
        }),
    ],
  })
}

export default new Event('voiceStateUpdate', async (_client, before, after) => {
  const voiceRoomCreateChannel = await getSetting('voiceRoomCreateChannel')

  // Member Join
  if (before.channelId === null && after.channelId && after.member && after.channel) {
    eventMemberJoin(after.member.id)

    if (after.channelId === voiceRoomCreateChannel) {
      await voiceChannelCreate(after.member)
      return
    }

    await sendAlert(after.channel as TextBasedChannel, 'join', after.member)
    return
  }

  // Member Move
  if (before.channelId != null && before.channelId !== after.channelId && after.channelId) {
    if (before.channelId === voiceRoomCreateChannel) {
      return
    }

    await sendAlert(before.channel as TextBasedChannel, 'leave', before.member)

    if (!after.member) return

    if (after.channelId === voiceRoomCreateChannel) {
      await voiceChannelCreate(after.member)
      return
    }

    await sendAlert(after.channel as TextBasedChannel, 'join', after.member)
    return
  }

  // Member Leave
  if (before.member && before.channelId && after.channelId === null) {
    eventMemberLeave(before.member.id, before.channel?.name ?? '')

    if (before.channelId === voiceRoomCreateChannel) {
      return
    }

    if ((before.channel?.members.size ?? 0) < 1) {
      return await voiceChannelDelete(before.channelId)
    }

    await sendAlert(before.channel as TextBasedChannel, 'leave', before.member)
    return
  }
})
