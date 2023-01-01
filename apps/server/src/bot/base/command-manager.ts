import { ApplicationCommandDataResolvable, Collection, REST, Routes } from 'discord.js'
import { InteractionData } from '~/bot/types'

import { Logger } from '~/utils/logger'
import BaseManager from './base-manager'
import fs from 'fs'
import path from 'path'
import BotClient from './client'
import { InteractionType } from '~/bot/types'
import config from '~/config'
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
  public load(commandPath: string = path.join(__dirname, '../commands')): void {
    this.logger.debug('Loading commands...')

    try {
      const commandFolder = fs.readdirSync(commandPath)

      commandFolder.forEach((folder) => {
        if (!fs.lstatSync(path.join(commandPath, folder)).isDirectory()) return

        try {
          const commandFiles = fs.readdirSync(path.join(commandPath, folder))

          commandFiles.forEach((commandFile) => {
            try {
              const command =
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require(`../commands/${folder}/${commandFile}`).default

              if (!command.data.name)
                return this.logger.debug(`Command ${commandFile} has no name. Skipping.`)

              this.commands.set(command.data.name, command)

              this.logger.debug(`Loaded command ${command.name}`)
            } catch (error: any) {
              this.logger.error(`Error loading command '${commandFile}'.\n` + error.stack)
            } finally {
              this.logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`)
              // eslint-disable-next-line no-unsafe-finally
              return this.commands
            }
          })
        } catch (error: any) {
          this.logger.error(`Error loading command folder '${folder}'.\n` + error.stack)
        }
      })
    } catch (error: any) {
      this.logger.error('Error fetching folder list.\n' + error.stack)
    }
  }

  public get(commandName: string): SlashCommand | undefined {
    const command = this.commands.get(commandName)

    return command
  }

  public reload(commandPath: string = path.join(__dirname, '../commands')) {
    this.logger.debug('Reloading commands...')

    this.commands.clear()
    try {
      this.load(commandPath)
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
