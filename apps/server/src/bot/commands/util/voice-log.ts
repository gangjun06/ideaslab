import { SlashCommand } from '~/bot/base/command'
import config from '~/config'
import { formatSeconds, getCurrentVoiceLog } from '~/service/voice-log'
import { Embed } from '~/utils/embed'

import { SlashCommandBuilder } from 'discord.js'

export default new SlashCommand(
  new SlashCommandBuilder()
    .setName('통화방-사용시간')
    .setDescription('아이디어스랩 디스코드에서 통화방에 있었던 시간을 표시해요.'),
  async (client, interaction) => {
    const { current, today } = await getCurrentVoiceLog(interaction.user.id)
    const embed = new Embed(client, 'info')
      .setTitle('통화방 사용시간')
      .setURL(`${config.webURL}/settings/analytics/voice`)

    if (today) {
      embed.addFields({
        name: `전체 사용시간: \`${formatSeconds(today)}\``,
        value: '통화방 사용시간 측정 이후 통화방에 있었던 시간이에요.',
      })
    }

    if (current) {
      embed.addFields({
        name: `현재 통화방 사용시간: \`${formatSeconds(current)}\``,
        value: '연속해서 통화방을 사용한 시간이에요.',
      })
    }

    interaction.reply({ embeds: [embed], ephemeral: true })
  },
)
