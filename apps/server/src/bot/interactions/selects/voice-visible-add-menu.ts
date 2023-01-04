import { ChannelType } from 'discord.js'

import { SelectMenu } from '~/bot/base/interaction'

export default new SelectMenu('voice-visible-add-menu', async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return
  console.log(interaction.values)
})
