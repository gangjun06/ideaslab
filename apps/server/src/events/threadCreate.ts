import { Event } from '~/bot/event'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import { Embed } from '~/utils/embed'

export default new Event('threadCreate', async (client, threadChannel, newly) => {
  if (!newly) return

  // const embed = new Embed(client, 'success').
  const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel('웹에서 보기')
    .setURL('https://google.com')

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

  threadChannel.send({
    components: [row],
  })
})
