import config from '~/config'
import { Logger } from '~/utils/logger'

import { SlashCommand } from './command'
import CommandManager from './command-manager'
import ErrorManager from './error-manager'
import { Event } from './event'
import EventManager from './event-manager'
import { BaseInteraction } from './interaction'
// import DatabaseManager from './database-manager'
import InteractionManager from './interaction-manager'

import { Client, ClientEvents, ClientOptions, Collection } from 'discord.js'
import { config as dotenvConfig } from 'dotenv'

const logger = new Logger('bot')

export let client: BotClient

export default class BotClient extends Client {
  //   public readonly VERSION: string
  //   public readonly BUILD_NUMBER: string
  public readonly config = config

  public commands: Collection<string, SlashCommand> = new Collection()
  public events: Collection<keyof ClientEvents, Event<keyof ClientEvents>> = new Collection()
  public errors: Collection<string, string> = new Collection()
  public interactions: Collection<string | string[], BaseInteraction> = new Collection()

  public command: CommandManager = new CommandManager(this)
  public event: EventManager = new EventManager(this)
  public error: ErrorManager = new ErrorManager(this)
  public interaction: InteractionManager = new InteractionManager(this)

  public constructor(options: ClientOptions = { intents: 130815 }) {
    super(options)

    logger.info('Loading config data...')
    dotenvConfig()

    logger.info('Loading managers...')
    this.command.load()
    this.event.load()
    this.interaction.load()

    logger.info('Loading version data...')
  }

  public async start(token: string = config.botToken): Promise<void> {
    logger.info('Logging in bot...')
    await this.login(token).then(() => this.setStatus())
  }

  public async setStatus(status: 'dev' | 'online' = 'online', name = '점검중...') {
    //       this.user?.setPresence({
    //         activities: [{ name: `` }],
    //         status: 'online',
    //       })
  }
}

export const initClient = async () => {
  client = new BotClient()
}

export const currentGuild = async () => {
  const cached = client.guilds.cache.get(config.guildId)
  if (!cached) {
    return client.guilds.fetch(config.guildId)
  }
  return cached
}

export const currentGuildMember = async (memberId: string) => {
  const guild = await currentGuild()
  const cached = guild.members.cache.get(memberId)
  if (!cached) {
    return guild.members.fetch(memberId)
  }
  return cached
}
