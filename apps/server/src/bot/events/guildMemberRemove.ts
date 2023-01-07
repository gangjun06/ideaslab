import { Event } from '~/bot/base/event'
import { dbClient } from '~/lib/db'

export default new Event('guildMemberRemove', async (client, member) => {
  try {
    await dbClient.user.update({
      where: {
        discordId: member.id,
      },
      data: {
        leavedAt: new Date(),
      },
    })
  } catch {
    /* empty */
  }
  // const dmChannel = await member.createDM(true)

  // const embed = new Embed(client, 'info')
  //   .setTitle('아이디어스랩을 나가셨군요')
  //   .setDescription('저장된 개인정보는 1주일 후 자동으로 파기될 예정이에요.')

  // dmChannel.send({ embeds: [embed] })
})
