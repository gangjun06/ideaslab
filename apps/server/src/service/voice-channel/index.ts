import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  GuildMember,
  VoiceChannel,
} from 'discord.js'

import { client, currentGuild } from '~/bot/base/client'
import { Embed } from '~/utils/embed'

import { getSetting } from '../setting'
import { voiceComponents } from './builder'
import { chatroomList } from './constants'
import {
  delVoiceData,
  getDelVoiceOwner,
  getVoiceData,
  getVoiceOwner,
  setVoiceData,
  setVoiceOwner,
} from './redis'

export const voiceService = {}

export const findChatroomRule = (id: string) => {
  return chatroomList.find((chatroom) => chatroom.id === id)
}

export const voiceChannelCreate = async (
  member: GuildMember,
  name: string,
  ruleId: string,
  customRule: string,
) => {
  const guild = await currentGuild()
  const parentId = await getSetting('voiceRoomCategory')

  const rule = findChatroomRule(ruleId) ?? chatroomList.at(-1)!

  const channel = await guild.channels.create({
    name: `[${rule.emoji} ${rule.name}] ${name}`,
    parent: parentId,
    type: ChannelType.GuildVoice,
  })

  const embed = new Embed(client, 'info')
    .setTitle(name)
    .setDescription(
      '음성채팅방에 오신것을 환영해요 :wave:\n아래의 버튼을 눌러 원하는 설정을 하실 수 있어요.',
    )
    .setFields(
      {
        name: '기타 도움말',
        value: '`/음성채널-설정` 을 사용하여 설정할 수 있어요!',
      },
      {
        name: '채널 규칙',
        value: customRule,
      },
    )
    .setAuthor({ name: `채널 생성자: ${member.displayName}`, iconURL: member.displayAvatarURL() })

  const { row } = voiceComponents()

  await channel.send({ content: `<@${member.id}>`, embeds: [embed], components: [row] })

  await setVoiceOwner(channel.id, member.id)
  await setVoiceData(channel.id, {
    customRule: customRule,
    ruleId,
  })

  return channel
}

export const voiceChannelDelete = async (channelId: string) => {
  const data = await getDelVoiceOwner(channelId)
  if (data) {
    await delVoiceData(channelId)
    const guild = await currentGuild()
    await guild.channels.delete(channelId)
  }
}

export const voiceChannelSetRule = async (
  channelId: string,
  customRule: string,
  ruleId?: string,
) => {
  const data = await getVoiceData(channelId)
  const newRule = { ...data }
  newRule.ruleId = ruleId ?? data.ruleId
  newRule.customRule = customRule

  await setVoiceData(channelId, data)
  return data
}

export const voiceChannelState = async (channel: VoiceChannel) => {
  const userRole = await getSetting('userRole')
  const owner = await getVoiceOwner(channel.id)
  const data = await getVoiceData(channel.id)

  if (!userRole) return { isPrivate: false, owner, data }
  return { owner, data }
}

export const voiceChannelOwnerCheck = async (interaction: BaseInteraction) => {
  if (
    !interaction.channelId ||
    !interaction.channel ||
    interaction.channel.type !== ChannelType.GuildVoice ||
    !(interaction.isAnySelectMenu() || interaction.isButton() || interaction.isModalSubmit())
  )
    return false

  if (!interaction.channel.members.get(interaction.user.id)) {
    await interaction.reply({
      embeds: [new Embed(client, 'error').setTitle('채널에 먼저 접속하여 주세요.')],
      ephemeral: true,
    })
    return false
  }

  const owner = (await getVoiceOwner(interaction.channelId)) ?? ''
  if (interaction.user.id !== owner) {
    const embed = new Embed(client, 'error')
      .setTitle('채널 관리자가 아니군요.')
      .setDescription('음성채널 설정은 채널 관리자만 할 수 있어요.')

    const components = []

    if (interaction.channel && interaction.channel.type === ChannelType.GuildVoice) {
      const ownerData = interaction.channel.members.get(owner)
      if (!ownerData) {
        embed.addFields({
          name: '안내',
          value:
            '채널 관리자가 채널에 없는것 같군요.\n아래 버튼을 눌러 채널 관리자 권한을 얻을 수 있어요.',
        })
        components.push(
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Primary)
              .setLabel('권한 받기')
              .setCustomId('voice-claim'),
          ),
        )
      }
    }

    await interaction.reply({
      embeds: [embed],
      components,
      ephemeral: true,
    })
    return false
  }
  return true
}

export const voiceChannelClaim = async (channel: VoiceChannel, memberId: string) => {
  const currentOwner = await getVoiceOwner(channel.id)
  if (currentOwner && channel.members.get(currentOwner)) return false
  await setVoiceOwner(channel.id, memberId)
  return true
}

export * from './builder'
export * from './constants'
export * from './redis'
