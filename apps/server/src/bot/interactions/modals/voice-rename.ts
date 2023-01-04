import { Modal } from '~/bot/base/interaction'
import { Embed } from '~/utils/embed'

export default new Modal('modal.voice-rename', async (client, interaction) => {
  let newName = interaction.fields.getTextInputValue('nameInput')

  if (newName === '') {
    newName = `${interaction.member.displayName}님의 채널`
  }

  if (newName.length === 1) {
    await interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('채널 이름은 한 글자로 설정할 수 없어요.')],
      ephemeral: true,
    })
    return
  }

  try {
    await interaction.channel?.setName(newName)
  } catch {
    await interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('채널 이름 설정에 실패했어요.')],
      ephemeral: true,
    })
    return
  }

  await interaction.deferUpdate({})
  await interaction.channel?.send({
    embeds: [
      new Embed(client, 'success').setTitle(`채널 이름이 \`${newName}\` 으로 변경되었어요.`),
    ],
  })
})
