import { Button } from '~/bot/interaction'
import config from '~/config'
import { getLoginToken } from '~/service/auth'
import { Embed } from '~/utils/embed'

export default new Button(['register-complete'], async (client, interaction) => {
  const token = await getLoginToken(
    interaction.user.id,
    `${interaction.user.username}#${interaction.user.discriminator}`,
    interaction.user.displayAvatarURL(),
    false,
  )

  const embed = new Embed(client, 'success')
    .setTitle('아이디어스랩 가입 완료하기 [여기를 클릭]')
    .setURL(`${config.webURL}/signup?token=${token.token}`)
    .addFields({
      name: '기타',
      value: `관리자이시군요! 관리자 권한이 함께 설정되었어요.`,
    })
    .setFooter({ text: '링크는 10분 후 만료됩니다.' })

  interaction.reply({ embeds: [embed], ephemeral: true })
})
