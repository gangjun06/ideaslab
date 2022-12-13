import { Event } from '~/bot/event'
import { TextChannel } from 'discord.js'

export default new Event('voiceStateUpdate', async (client, before, after) => {
  //...
})
