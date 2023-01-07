import type { ClientEvents } from 'discord.js'

import { events } from '~/_generated/events'
import { Logger } from '~/utils/logger'

import BaseManager from './base-manager'
import type BotClient from './client'
import { Event } from './event'

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
        this.logger.debug(`Loaded event ${event.name}`)
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

  /**
   * @example EventManager.register('ready', (client) => {
   *  console.log(`${client.user.tag} is ready!`)
   * })
   */
  public register(
    eventName: keyof ClientEvents,
    fn: (client: BotClient, ...args: ClientEvents[keyof ClientEvents]) => Promise<any>,
  ) {
    const eventFuntion = {
      name: eventName,
      execute: fn,
      options: {
        once: true,
      },
    }
    this.events.set(eventName, eventFuntion)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.client.on(eventName, fn)

    this.logger.debug(`Registered event '${eventName}'`)
  }
}
