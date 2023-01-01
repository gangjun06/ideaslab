import { Event } from '~/bot/base/event'
import { eventMemberJoin, eventMemberLeave } from '~/service/voice-log'
import { Embed } from '~/utils/embed'

import { GuildMember, TextBasedChannel } from 'discord.js'

const sendAlert = async (
  channel: TextBasedChannel,
  type: 'join' | 'leave',
  member?: GuildMember | null,
) =>
  channel.send({
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

export default new Event('voiceStateUpdate', async (_client, before, after) => {
  console.log(before, after)
  // Member Join
  if (before.channelId === null && after.channelId && after.member && after.channel) {
    eventMemberJoin(after.member.id)
    await sendAlert(after.channel as TextBasedChannel, 'join', after.member)
    return
  }

  // Member Move
  if (before.channelId != null && before.channelId !== after.channelId && after.channelId) {
    await sendAlert(before.channel as TextBasedChannel, 'leave', before.member)
    await sendAlert(after.channel as TextBasedChannel, 'join', after.member)
    return
  }

  // Member Leave
  if (before.member && before.channelId && after.channelId === null) {
    eventMemberLeave(before.member.id)
    await sendAlert(before.channel as TextBasedChannel, 'leave', before.member)
    return
  }
})
