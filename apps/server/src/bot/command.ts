import { SlashCommandBuilder } from 'discord.js'
import { InteractionData, SlashCommandFunction } from '~/types'

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
