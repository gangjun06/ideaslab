import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  StringSelectMenuBuilder,
} from 'discord.js'

import { Embed } from '~/utils/embed'

import { chatroomList } from './constants'

export const voiceRuleSettingMessageContent = ({
  client,
  forCreate,
  selected,
  customRule,
}: {
  client: Client
  forCreate: boolean
  selected: string
  customRule: string
}) => {
  let components

  if (forCreate) {
    components = [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        chatroomList.map((item) =>
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`create-voice-${item.id}`)
            .setLabel(`${item.name}`)
            .setEmoji(item.emoji),
        ),
      ),
    ]
  } else {
    components = [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(forCreate ? 'create-voice' : 'menu.voice-rule-edit')
          .setPlaceholder('설정할 규칙을 선택하세요.')
          .addOptions(
            chatroomList.map((item) => ({
              label: `카테고리 변경: ${item.name}`,
              value: item.id,
              description: item.description,
              emoji: item.emoji,
              default: item.id === selected,
            })),
          ),
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setCustomId('voice-rule-edit')
          .setLabel('규칙 변경하기'),
      ),
    ]
  }

  let embeds

  if (forCreate) {
    embeds = chatroomList.map((item) =>
      new Embed(client, 'info')
        .setTitle(`${item.emoji} ${item.name}`)
        .setDescription(item.description)
        .addFields({
          name: '**<기본 규칙>**',
          value: `\`\`\`${item.rule}\`\`\``,
        }),
    )
  } else {
    const selectedRule = chatroomList.find((item) => item.id === selected)
    embeds = [
      new Embed(client, 'info')
        .setTitle('음성채팅방 규칙 설정')
        .setDescription(`음성채팅방에서 무슨 활동을 할 수 있는지 설정할 수 있습니다.`)
        .setFields({
          name: '**<현재 규칙>**',
          value: `**[${selectedRule?.emoji} ${selectedRule?.name}]**\n${customRule}`,
        }),

      new Embed(client, 'info').setTitle('음성채팅방 규칙 카테고리').addFields(
        chatroomList.map((item) => ({
          name: `${selected === item.id ? '(선택됨) ' : ''}${item.emoji} ${item.name}`,
          value: `${item.description}\n\`\`\`기본규칙:\n${item.rule}\`\`\``,
        })),
      ),
    ]
  }

  return { embeds, components }
}

export const voiceComponents = () => {
  const renameButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel('이름 변경하기')
    .setCustomId('voice-rename')

  const ruleButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('규칙 변경하기')
    .setCustomId('voice-rule-start-edit')

  const limitButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('인원수 제한하기')
    .setCustomId('voice-limit')

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    renameButton,
    ruleButton,
    limitButton,
  )

  return { row }
}
