import { ActionRowBuilder, ChannelType, UserSelectMenuBuilder } from 'discord.js'

import { Button } from '~/bot/base/interaction'

export default new Button(
  ['voice-visible-add', 'voice-visible-remove'],
  async (client, interaction) => {
    if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return

    if (interaction.customId === 'voice-visible-add') {
      await interaction.reply({
        ephemeral: true,
        components: [
          new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
            new UserSelectMenuBuilder({
              customId: 'voice-visible-add-menu',
              maxValues: 20,
              minValues: 0,
              placeholder: '추가할 맴버를 선택하세요',
            }),
          ),
        ],
      })
    }
  },
)
