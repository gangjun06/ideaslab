import { Button } from '~/bot/base/interaction'
import { ticketClose } from '~/service/ticket'

export default new Button(['close-support'], async (client, interaction) => {
  if (!interaction.channel) return

  await ticketClose(interaction.channel.isDMBased() ? 'user' : 'manager', interaction.channelId)

  await interaction.reply({ content: '대화를 종료하였습니다.' })
})
