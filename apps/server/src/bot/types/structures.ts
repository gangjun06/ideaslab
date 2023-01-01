import type {
  Message,
  ClientEvents,
  ChatInputCommandInteraction,
  Interaction,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord.js'
import BotClient from '~/bot/base/client'

export interface MessageCommandOptions {
  name: string
  description?: string
  aliases: string[]
}

export type MessageCommandFuntion = (
  client: BotClient,
  message: Message<true>,
  args: string[],
) => Promise<any> | Promise<any>

export type SlashCommandFunction = (
  client: BotClient,
  interaction: ChatInputCommandInteraction,
) => Promise<any>

export interface SlashCommandOptions {
  name: string
  isSlash?: boolean
}

export type EventFunction<E extends keyof ClientEvents> = (
  client: BotClient,
  ...args: ClientEvents[E]
) => Promise<any>

export interface EventOptions {
  once: boolean
}

export type BaseInteractionFunction<T = Interaction> = (
  client: BotClient,
  interaction: T,
) => Promise<any>

export type InteractionData = RESTPostAPIApplicationCommandsJSONBody
