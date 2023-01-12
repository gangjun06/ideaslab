import { ChannelType, MessageType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { ignoreError } from '~/utils'

import { currentGuildChannel } from '../base/client'

export default new Event('messageUpdate', async (client, message, newEventMessage) => {
  let newMessage = newEventMessage
  if (!newEventMessage.author) {
    const res = await currentGuildChannel(newEventMessage.id)
    if (!res || !res.isTextBased()) return
    newMessage = await res.messages.fetch(res.id)
  }

  if (newMessage.channel.type !== ChannelType.PublicThread) return
  if (!newMessage.channel.parentId) return
  if (newMessage.channel.parent?.type !== ChannelType.GuildForum) return
  if (newMessage.type !== MessageType.Default && message.type !== MessageType.Reply) return
  if (newMessage.author?.bot) return

  if (!newMessage.content?.length) return

  try {
    // Update Comment
    await dbClient.comment.update({
      where: {
        discordId: newMessage.id,
      },
      data: {
        content: newMessage.content,
      },
    })
  } catch (e) {
    console.error(e)
    // Update Gallery Post
    await ignoreError(
      dbClient.post.update({
        where: {
          discordId: message.channel.id,
        },
        data: {
          content: newMessage.content,
        },
      }),
    )
  }
})
