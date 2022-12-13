import { InteractionType as DInteractionType } from 'discord.js'
import CommandManager from '~/bot/command-manager'
import ErrorManager from '~/bot/error-manager'
import InteractionManager from '~/bot/interaction-manager'
import { Event } from '~/bot/event'
import { InteractionType } from '~/types'

export default new Event('interactionCreate', async (client, interaction) => {
  const commandManager = new CommandManager(client)
  const errorManager = new ErrorManager(client)
  const interactionManager = new InteractionManager(client)
  if (!interaction.inCachedGuild()) return

  if (interaction.isChatInputCommand()) {
    if (interaction.user.bot) return

    const command = commandManager.get(interaction.commandName)
    try {
      if (command) {
        command?.execute(client, interaction)
      }
      //await interaction.deferReply().catch(() => { })
    } catch (error: any) {
      errorManager.report(error, { executer: interaction, isSend: true })
    }
  } else if (interaction.isButton()) {
    const interactionData = interactionManager.get(interaction.customId)

    if (!interactionData) return
    if (interactionData.type !== InteractionType.Button) return

    try {
      interactionData.execute(client, interaction)
    } catch (error: any) {
      errorManager.report(error, { executer: interaction, isSend: true })
    }
  } else if (interaction.isSelectMenu()) {
    const interactionData = interactionManager.get(interaction.customId)

    if (!interactionData) return
    if (interactionData.type !== InteractionType.Select) return

    try {
      interactionData.execute(client, interaction)
    } catch (error: any) {
      errorManager.report(error, { executer: interaction, isSend: true })
    }
  } else if (
    interaction.isContextMenuCommand() ||
    interaction.isUserContextMenuCommand() ||
    interaction.isMessageContextMenuCommand()
  ) {
    const interactionData = interactionManager.get(interaction.commandName)

    if (!interactionData) return
    if (interactionData.type !== InteractionType.ContextMenu) return

    try {
      interactionData.execute(client, interaction)
    } catch (error: any) {
      errorManager.report(error, { executer: interaction, isSend: true })
    }
  } else if (interaction.type === DInteractionType.ModalSubmit) {
    const interactionData = interactionManager.get(interaction.customId)

    if (!interactionData) return
    if (interactionData.type !== InteractionType.Modal) return

    try {
      interactionData.execute(client, interaction)
    } catch (error: any) {
      errorManager.report(error, { executer: interaction, isSend: true })
    }
  } else if (interaction.type === DInteractionType.ApplicationCommandAutocomplete) {
    const interactionData = interactionManager.get(interaction.commandName)

    if (!interactionData) return
    if (interactionData.type !== InteractionType.AutoComplete) return

    try {
      interactionData.execute(client, interaction)
    } catch (error: any) {
      errorManager.report(error)
    }
  }
})
