import { SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '~/bot/command'
import config from '~/config'
import { getLoginToken } from '~/service/auth'
import { Embed } from '~/utils/embed'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('로그인')
    .setDescription('아이디어스랩 웹사이트에 로그인합니다.'),
  async (client, interaction) => {
    const { token, pin } = await getLoginToken(
      interaction.user.id,
      `${interaction.user.username}#${interaction.user.discriminator}`,
      interaction.user.displayAvatarURL(),
      interaction.memberPermissions?.has('Administrator') ?? false,
    )

    const embed = new Embed(client, 'success')
      .setTitle('아이디어스랩 웹사이트 로그인 [여기를 클릭]')
      .setURL(`${config.webURL}/login?token=${token}`)
      .setDescription('로그인 링크 / PIN 코드를 절대 타인과 공유하지 마세요')
      .addFields({
        name: 'PIN 코드로 로그인',
        value: `아래의 PIN 코드를 입력해주세요. [웹사이트 -> 로그인](${config.webURL}) 에서 입력하실 수 있어요.\n**||${pin}||**`,
      })
      .addFields({
        name: '기타',
        value: `관리자이시군요! 관리자 권한이 함께 설정되었어요.`,
      })
      .setFooter({ text: '로그인 링크 및 PIN 코드는 10분 후 만료됩니다.' })

    interaction.reply({ embeds: [embed], ephemeral: true })
  },
)
