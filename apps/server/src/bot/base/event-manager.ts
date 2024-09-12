import { events } from '~/_generated/events'
import { Logger } from '~/utils/logger'

import BaseManager from './base-manager.js'
import type BotClient from './client.js'
import { Event } from './event.js'

/**
 * @extends {BaseManager}
 */
export default class EventManager extends BaseManager {
  private logger: Logger
  private events: BotClient['events']

  constructor(client: BotClient) {
    super(client)

    this.logger = new Logger('EventManager')

    this.events = client.events
  }

  public async load() {
    this.logger.debug('Loading events...')

    events.forEach(async (event) => {
      try {
        if (!event.name) return this.logger.debug(`Event has no name. Skipping.`)

        this.events.set(event.name, event)
      } catch (error: any) {
        this.logger.error(`Error loading events '${event.name}'.\n` + error.stack)
      }
    })
    this.logger.debug(`Succesfully loaded events. count: ${this.events.size}`)

    this.start()
  }

  private async start() {
    this.logger.debug('Starting event files...')

    this.events.forEach((event, eventName) => {
      if (!Event.isEvent(event)) return

      if (event.options?.once) {
        this.client.once(eventName, (...args) => {
          event.execute(this.client, ...args)
        })

        this.logger.debug(`Started event '${eventName}' once.`)
      } else {
        this.client.on(eventName, (...args) => {
          event.execute(this.client, ...args)
        })

        this.logger.debug(`Started event '${eventName}' on.`)
      }
    })
  }

  public reload() {
    this.logger.debug('Reloading events...')

    this.events.clear()

    this.load()
  }
}
