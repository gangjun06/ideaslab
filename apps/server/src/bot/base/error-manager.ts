import { Message, WebhookClient } from 'discord.js'
import { v4 } from 'uuid'

import { ErrorReportOptions } from '~/bot/types'
import config from '~/config'
import { Embed } from '~/utils/embed'
import { Logger } from '~/utils/logger'

import BaseManager from './base-manager'
import BotClient from './client'

/**
 * @extends BaseManager
 */
export default class ErrorManager extends BaseManager {
  private logger: Logger

  public constructor(client: BotClient) {
    super(client)

    this.logger = new Logger('bot')
  }

  public report(error: Error, options?: ErrorReportOptions) {
    this.logger.error(error.stack as string)

    const date = (Number(new Date()) / 1000) | 0
    const errorText = `**[<t:${date}:T> ERROR]** ${error.stack}`
    const errorCode = v4()

    this.client.errors.set(errorCode, error.stack as string)

    const errorEmbed = new Embed(this.client, 'error')
      .setTitle('오류가 발생했습니다.')
      .setDescription('명령어 실행 도중에 오류가 발생하였습니다.')
      .addFields([{ name: '오류 코드', value: errorCode, inline: true }])

    if (options && options.isSend) {
      try {
        ;(options.executer as Message).reply({ embeds: [errorEmbed] })
      } catch {
        /* empty */
      }
    }

    if (config.errorWebhook !== '') {
      const webhook = new WebhookClient({
        url: config.errorWebhook,
      })

      webhook.send(errorText)
    }
  }
}
