import { ChannelType } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { Event } from '~/bot/base/event'
import { getSetting } from '~/service/setting'
import { ignoreError } from '~/utils'
import { Embed } from '~/utils/embed'
import { mosaicNick } from '~/utils/nick'

export default new Event('guildBanAdd', async (client, ban) => {
  await ignoreError(
    dbClient.user.update({
      where: {
        discordId: ban.user.id,
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

  const userName = mosaicNick(ban.user.username)
  const userAvatar = ban.user.displayAvatarURL()
  setTimeout(() => {
    ban.fetch().then(async (ban) => {
      const embed = new Embed(client, 'error')
        .setTitle(`@${userName} 이 아이디어스 랩에서 차단되었습니다`)
        .setAuthor({
          name: userName,
          iconURL: userAvatar,
        })
        .setDescription(`**사유**:\n\`\`\`\n${ban.reason ?? '불러오는데 실패하였습니다'}\n\`\`\``)

      await channel.send({ embeds: [embed] })
    })
  }, 3000)
})
