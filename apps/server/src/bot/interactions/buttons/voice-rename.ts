import {
  ActionRowBuilder,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'

import { Button } from '~/bot/base/interaction'

export default new Button(['voice-rename'], async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return

  const modal = new ModalBuilder().setCustomId('modal.voice-rename').setTitle('음성채널 이름 변경')

  const favoriteColorInput = new TextInputBuilder()
    .setCustomId('nameInput')
    .setLabel('변경할 이름을 입력해 주세요.')
    .setValue(interaction.channel.name)
    .setPlaceholder(`${interaction.member.displayName}님의 채널`)
    .setMaxLength(32)
    .setStyle(TextInputStyle.Short)

  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(favoriteColorInput)

  modal.addComponents(firstActionRow)

  // Show the modal to the user
  await interaction.showModal(modal)

  //   const embed = new Embed(client, 'success')
  //     .setTitle('아이디어스랩 가입 완료하기 [여기를 클릭]')
  //     .setURL(`${config.webURL}/signup?token=${token.token}`)
  //     .addFields({
  //       name: '기타',
  //       value: `관리자이시군요! 관리자 권한이 함께 설정되었어요.`,
  //     })
  //     .setFooter({ text: '링크는 10분 후 만료됩니다.' })

  //   interaction.reply({ embeds: [embed], ephemeral: true })
})
