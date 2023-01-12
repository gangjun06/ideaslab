import { ClientEvents } from 'discord.js'

import { EventFunction, EventOptions } from '~/bot/types'

/**
 * @example
 * export default new Event('ready', (client) => {
 *    console.log('ready')
 * })
 */
export class Event<E extends keyof ClientEvents> {
  constructor(public name: E, public execute: EventFunction<E>, public options?: EventOptions) {}

  static isEvent(event: unknown): event is Event<keyof ClientEvents> {
    return event instanceof Event
  }
}
