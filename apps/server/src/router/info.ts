import { router, publicProcedure } from '~/api/trpc'
import { currentGuild } from '~/bot/client'
import { ChannelType } from 'discord.js'

type Channel = {
  id: string
  name: string
  parentId: string | null
  type: ChannelType
}

export const infoRouter = router({
  stat: publicProcedure.query(async ({ ctx }) => {
    const members = (await currentGuild()).memberCount

    return {
      memberCount: members,
    }
  }),
  channels: publicProcedure.query(async ({ ctx }) => {
    const guild = await currentGuild()

    const channels = await guild.channels.fetch()
    if (!channels) return []

    const guildChannelList: Channel[] = []

    channels.forEach((d) => {
      if (
        d?.type === ChannelType.GuildText ||
        d?.type === ChannelType.GuildForum ||
        d?.type === ChannelType.GuildCategory
      ) {
        guildChannelList.push({
          id: d.id,
          name: d.name,
          parentId: d.parentId,
          type: d.type,
        })
      }
    })

    return guildChannelList
  }),
})
