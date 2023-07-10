import { ChannelType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { getSetting } from '~/service/setting'
import { ignoreError } from '~/utils'

export default new Event('guildBanAdd', async (client, member) => {
  await ignoreError(
    dbClient.user.update({
      where: {
        discordId: member.user.id,
      },
      data: {
        leavedAt: new Date(),
      },
    }),
  )

  const blackListChannel = await getSetting('blacklistChannel')
  if (!blackListChannel) return
  const channel = await client.channels.fetch(blackListChannel)
  if (!channel || channel.type !== ChannelType.GuildText) return

  // channel.send({
  //   embeds: [

  // })

  // const dmChannel = await member.createDM(true)

  // const embed = new Embed(client, 'info')
  //   .setTitle('아이디어스랩을 나가셨군요')
  //   .setDescription('저장된 개인정보는 1주일 후 자동으로 파기될 예정이에요.')

  // dmChannel.send({ embeds: [embed] })
})
