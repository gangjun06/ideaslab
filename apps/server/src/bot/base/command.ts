import { SlashCommandOptionsOnlyBuilder } from 'discord.js'

import { InteractionData, SlashCommandFunction } from '~/bot/types'

/**
 * @example
 * export default new SlashCommand(
 *    new SlashCommandBuilder()
 *      .setName('ping')
 *      .setDescription('ping, pong'),
 *    async (client, interaction) => {
 *      interaction.reply('Pong!')
 *  })
 */
export class SlashCommand {
  public data: InteractionData
  constructor(builder: SlashCommandOptionsOnlyBuilder, public execute: SlashCommandFunction) {
    this.data = builder.toJSON()
  }
}
