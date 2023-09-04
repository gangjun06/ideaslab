import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

import { SlashCommand } from '~/bot/base/command'
import { getSetting } from '~/service/setting'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('아카이브-삭제')
    .setDescription('[관리자용] 아카이브된 음성 채널을 삭제할 수 있어요')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async (client, interaction) => {
    interaction.deferReply({ ephemeral: true })
    const archiveCategory = await getSetting('archiveCategory')

    if (!archiveCategory) {
      return interaction.editReply({
        content: '아카이브 카테고리가 설정되지 않았어요.',
      })
    }

    const content = await interaction.guild?.channels.fetch(archiveCategory)
    if (content?.type !== ChannelType.GuildCategory) {
      return interaction.editReply({
        content: '아카이브 카테고리가 올바르게 설정되지 않았어요.',
      })
    }

    const channels = content.children.cache
    for (const channel of channels.values()) {
      await channel.delete()
    }
    await interaction.editReply({ content: '인증 메시지를 전송했어요.' })
  },
)
