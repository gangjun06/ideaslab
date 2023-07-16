import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

import { currentGuildMember } from '~/bot/base/client'
import { SlashCommand } from '~/bot/base/command'
import { ticketService } from '~/service/ticket'
import { Embed } from '~/utils/embed'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('dm전송')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('사용자에게 DM을 전송합니다.')
    .addUserOption((option) =>
      option
        .setName('사용자')
        .setDescription('DM을 전송할 사용자를 선택해주세요.')
        .setRequired(true),
    )
    .addBooleanOption((option) =>
      option.setName('티켓생성').setDescription('티켓을 생성할지 선택해주세요.').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('내용').setDescription('전송할 DM의 내용을 입력해주세요.').setRequired(true),
    ),
  async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true })

    const user = interaction.options.getUser('사용자', true)
    const isTicket = interaction.options.getBoolean('티켓생성', true)
    const content = interaction.options.getString('내용', true)

    const member = await currentGuildMember(user.id)

    if (isTicket) {
      ticketService.createTicketFromManager(member, content)
    }

    try {
      const dmChannel = await user.createDM(true)
      const embed = new Embed(client, 'info')
        .setDescription(content)
        .setTitle('관리진으로부터 메시지가 도착하였습니다')

      await dmChannel.send({ embeds: [embed] })

      await interaction.editReply({ content: 'DM을 전송했습니다.' })
    } catch {
      await interaction.editReply({ content: 'DM을 전송하지 못했습니다.' })
    }

    return
  },
)
