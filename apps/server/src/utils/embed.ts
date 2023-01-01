import { EmbedType } from '~/bot/types'

import { type Client, type EmbedData, EmbedBuilder } from 'discord.js'

export class Embed extends EmbedBuilder {
  constructor(client: Client, type: EmbedType) {
    if (!client.isReady()) return

    const EmbedJSON: EmbedData = {
      timestamp: new Date().toISOString(),
      footer: {
        iconURL: client.user.avatarURL() ?? undefined,
        text: client.user.username,
      },
    }

    super(EmbedJSON)

    if (type === 'success') this.setColor('#57F287')
    else if (type === 'error') this.setColor('#ED4245')
    else if (type === 'warn') this.setColor('#FEE75C')
    else if (type === 'info') this.setColor('#5865F2')
    else if (type === 'default') this.setColor('#5865F2')
    else this.setColor(type)
  }

  setType(type: EmbedType) {
    if (type === 'success') this.setColor('#57F287')
    else if (type === 'error') this.setColor('#ED4245')
    else if (type === 'warn') this.setColor('#FEE75C')
    else if (type === 'info') this.setColor('#5865F2')
    else if (type === 'default') this.setColor('#5865F2')
    else this.setColor(type)
  }
}
