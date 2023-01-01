import { InteractionData, SlashCommandFunction } from '~/bot/types'

import { SlashCommandBuilder } from 'discord.js'

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
  constructor(builder: SlashCommandBuilder, public execute: SlashCommandFunction) {
    this.data = builder.toJSON()
  }
}
