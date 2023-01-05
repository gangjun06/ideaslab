import {
  AutocompleteInteraction,
  ButtonInteraction,
  CacheType,
  ChannelSelectMenuInteraction,
  ContextMenuCommandInteraction,
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  SelectMenuInteraction,
  UserSelectMenuInteraction,
} from 'discord.js'

import { BaseInteractionFunction, InteractionData } from '~/bot/types'
import { InteractionType } from '~/bot/types'

export class Button {
  public type: InteractionType.Button = InteractionType.Button
  constructor(
    public customId: string | string[],
    public execute: BaseInteractionFunction<ButtonInteraction<'cached'>>,
  ) {}
}

type SelectMenuType = 'role' | 'user' | 'string' | 'channel' | 'mention'
type SelectMenuDiscordType<T extends SelectMenuType, U extends CacheType> = T extends 'role'
  ? UserSelectMenuInteraction<U>
  : T extends 'role'
  ? RoleSelectMenuInteraction<U>
  : T extends 'string'
  ? UserSelectMenuInteraction<U>
  : T extends 'channel'
  ? ChannelSelectMenuInteraction<U>
  : MentionableSelectMenuInteraction<U>

export class SelectMenu<T extends SelectMenuType> {
  public type: InteractionType.Select = InteractionType.Select
  constructor(
    public menuType: T,
    public customId: string | string[],
    public execute: BaseInteractionFunction<SelectMenuDiscordType<T, 'cached'>>,
  ) {}
}

export class ContextMenu {
  public type: InteractionType.ContextMenu = InteractionType.ContextMenu
  constructor(
    public customId: string | string[],
    public data: InteractionData,
    public execute: BaseInteractionFunction<ContextMenuCommandInteraction<'cached'>>,
  ) {}
}

export class Modal {
  public type: InteractionType.Modal = InteractionType.Modal
  constructor(
    public customId: string | string[],
    public execute: BaseInteractionFunction<ModalSubmitInteraction<'cached'>>,
  ) {}
}

export class AutoComplete {
  public type: InteractionType.AutoComplete = InteractionType.AutoComplete
  constructor(
    public customId: string | string[],
    public execute: BaseInteractionFunction<AutocompleteInteraction<'cached'>>,
  ) {}
}

export type BaseInteraction<T extends SelectMenuType = any> =
  | Button
  | SelectMenu<T>
  | ContextMenu
  | Modal
  | AutoComplete
