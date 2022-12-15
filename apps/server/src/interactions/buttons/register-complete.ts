import { Button } from '~/bot/interaction'
import { getLoginToken } from '~/service/auth'

export default new Button(['register-complete'], async (client, interaction) => {
  const token = await getLoginToken(
    interaction.user.id,
    `${interaction.user.username}#${interaction.user.discriminator}`,
    interaction.user.displayAvatarURL(),
    false,
  )

  interaction.reply('You clicked the button!')
})
