import { ChannelType } from 'discord.js'

import { Event } from '~/bot/base/event'
import { getGalleryCategory } from '~/service/gallery'
import { pointService } from '~/service/point'

export default new Event('threadCreate', async (client, threadChannel, newly) => {
  if (!newly) return
  if (!threadChannel.parentId || !threadChannel.ownerId) return
  if (!threadChannel.parent || threadChannel.parent.type !== ChannelType.GuildForum) return

  {
    const category = await getGalleryCategory(threadChannel.parentId)
    if (category) return
    pointService.event(threadChannel.ownerId, 'thread-create')
  }
})
