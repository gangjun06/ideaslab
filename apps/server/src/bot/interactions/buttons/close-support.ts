import { Button } from '~/bot/base/interaction'
import { ticketClose } from '~/service/ticket'

export default new Button(['close-support'], async (_client, interaction) => {
  if (!interaction.channel) return

  await interaction.deferReply()

  const result = await ticketClose(
    interaction.channel.isDMBased() ? 'user' : 'manager',
    interaction.channelId,
  )
  if (!result) {
    await interaction.editReply({ content: '닫을 티켓을 찾지 못하였습니다.' })
    return
  }

  await interaction.editReply({ content: '대화를 종료하였습니다.' })
})
