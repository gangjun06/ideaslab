import { ApplicationCommandDataResolvable, Collection, REST, Routes } from 'discord.js'

import { commands } from '~/_generated/commands'
import { InteractionData } from '~/bot/types'
import { InteractionType } from '~/bot/types'
import config from '~/config'
import { Logger } from '~/utils/logger'

import BaseManager from './base-manager'
import BotClient from './client'
import { SlashCommand } from './command'

export default class CommandManager extends BaseManager {
  private logger = new Logger('CommandManager')
  private commands: BotClient['commands']

  public constructor(client: BotClient) {
    super(client)

    this.commands = client.commands
  }

  /**
   * Load Commands from "../commands" folder
   */
  public load(): void {
    this.logger.debug('Loading commands...')

    commands.forEach((command) => {
      try {
        this.commands.set(command.data.name, command)

        this.logger.debug(`Loaded command ${command.data.name}`)
      } catch (error: any) {
        this.logger.error(`Error loading command '${command.data.name}'.\n` + error.stack)
      } finally {
        this.logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`)
        // eslint-disable-next-line no-unsafe-finally
        return this.commands
      }
    })
  }

  public get(commandName: string): SlashCommand | undefined {
    const command = this.commands.get(commandName)

    return command
  }

  public reload() {
    this.logger.debug('Reloading commands...')

    this.commands.clear()
    try {
      this.load()
    } finally {
      this.logger.debug('Succesfully reloaded commands.')
      // eslint-disable-next-line no-unsafe-finally
      return { message: '[200] Succesfully reloaded commands.' }
    }
  }

  public async slashCommandSetup(
    guildID: string,
  ): Promise<ApplicationCommandDataResolvable[] | undefined> {
    this.logger.scope = 'CommandManager: SlashSetup'
    const rest = new REST().setToken(this.client.token!)

    const interactions: Collection<string, InteractionData> = new Collection()

    this.client.interactions.forEach((command) => {
      if (command.type === InteractionType.ContextMenu) {
        interactions.set(command.data.name, command.data)
      }
    })

    this.client.commands.forEach((command) => {
      interactions.set(command.data.name, command.data)
    })

    if (!guildID) {
      this.logger.warn('guildID not gived switching global command...')
      this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`)

      await rest
        .put(Routes.applicationCommands(config.botId), {
          body: interactions.toJSON(),
        })
        .then(() => this.logger.info(`Successfully registered application global commands.`))

      return interactions.toJSON()
    } else {
      this.logger.info(`Slash Command requesting ${guildID}`)
      const commands = await this.client.application?.commands
        .fetch()
        .then((cmd) => cmd.map((cmd) => cmd.name))

      const resolvedData = interactions.filter((cmd) =>
        commands ? !commands.includes(cmd.name) : true,
      )

      rest.setToken(config.botToken)

      await rest
        .put(Routes.applicationGuildCommands(config.botId, guildID), {
          body: resolvedData.toJSON(),
        })
        .then(() => this.logger.info(`Successfully registered server ${guildID} server commands.`))

      return resolvedData.toJSON()
    }
  }
}
