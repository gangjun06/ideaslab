import { interactions } from '~/_generated/interactions'
import { Logger } from '~/utils/logger'

import BaseManager from './base-manager'
import BotClient from './client'
import { BaseInteraction } from './interaction'

export default class InteractionManager extends BaseManager {
  private logger = new Logger('InteractionManager')
  public readonly interactions: BotClient['interactions']

  constructor(client: BotClient) {
    super(client)

    this.interactions = client.interactions
  }

  public async load() {
    this.logger.debug('Loading interactions...')

    interactions.forEach((interaction) => {
      this.interactions.set(interaction.customId, interaction)

      this.logger.debug(
        `Succesfully loaded interaction ${interaction.customId}. count: ${this.interactions.size}`,
      )
    })
  }

  public get(customId: string): BaseInteraction | undefined {
    return this.interactions.find((_, id) => id.includes(customId))
  }
}
