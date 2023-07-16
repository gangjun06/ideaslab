import { Button } from '~/bot/base/interaction'
import { ticketService } from '~/service/ticket'

export default new Button(
  ['close-support', 'close-support-silent'],
  async (_client, interaction) => {
    if (!interaction.channel) return

    await interaction.deferReply()

    const result = await ticketService.ticketClose(
      interaction.channel.isDMBased() ? 'user' : 'manager',
      interaction.channelId,
      interaction.customId === 'close-support-silent',
    )
    if (!result) {
      await interaction.editReply({ content: '닫을 티켓을 찾지 못하였습니다.' })
      return
    }

    await interaction.editReply({ content: '대화를 종료하였습니다.' })
  },
)
