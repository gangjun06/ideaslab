import { InteractionType as DInteractionType } from 'discord.js'
import CommandManager from '~/bot/command-manager'
import ErrorManager from '~/bot/error-manager'
import InteractionManager from '~/bot/interaction-manager'
import { Event } from '~/bot/event'
import { Embed } from '~/utils/embed'
import { InteractionType } from '~/types'
import { dbClient } from '@ideaslab/db'

export default new Event('guildMemberRemove', async (client, member) => {
  await dbClient.user.update({
    where: {
      discordId: member.id,
    },
    data: {
      leavedAt: new Date(),
    },
  })
  // const dmChannel = await member.createDM(true)

  // const embed = new Embed(client, 'info')
  //   .setTitle('아이디어스랩을 나가셨군요')
  //   .setDescription('저장된 개인정보는 1주일 후 자동으로 파기될 예정이에요.')

  // dmChannel.send({ embeds: [embed] })
})
