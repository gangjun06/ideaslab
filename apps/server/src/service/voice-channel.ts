import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  GuildMember,
  OverwriteType,
  VoiceChannel,
} from 'discord.js'

import { client, currentGuild, currentGuildMember } from '~/bot/base/client'
import config from '~/config'
import { redis } from '~/lib/redis'
import { Embed } from '~/utils/embed'

import { getSetting } from './setting'

const redisVoiceOwnerKey = (key: string) => `${config.redisPrefix}voice:${key}`
const redisVoiceOwnerExpire = 60 * 60 * 24 * 14

export const voiceComponents = () => {
  const renameButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel('이름 변경하기')
    .setCustomId('voice-rename')

  const limitButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('인원수 제한하기')
    .setCustomId('voice-limit')

  const visibleButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel('공개 설정')
    .setCustomId('voice-visible')

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    renameButton,
    limitButton,
    visibleButton,
  )

  return { row }
}

export const voiceChannelCreate = async (member: GuildMember) => {
  const guild = await currentGuild()
  const parentId = await getSetting('voiceRoomCategory')

  const name = `${member.displayName}님의 채널`

  const channel = await guild.channels.create({
    name,
    parent: parentId,
    type: ChannelType.GuildVoice,
  })

  await member.voice.setChannel(channel)

  const embed = new Embed(client, 'info')
    .setTitle(name)
    .setDescription(
      '음성채팅방에 오신것을 환영해요 :wave:\n아래의 버튼을 눌러 원하는 설정을 하실 수 있어요.\n만약 스크롤이 올라가 버튼을 찾기 힘들다면 /음성채널-설정을 이용하세요.',
    )
    .setAuthor({ name: `채널 생성자: ${member.displayName}`, iconURL: member.displayAvatarURL() })

  const { row } = voiceComponents()

  await channel.send({ content: `<@${member.id}>`, embeds: [embed], components: [row] })

  await redis.set(redisVoiceOwnerKey(channel.id), member.id, 'EX', redisVoiceOwnerExpire)
}

export const voiceChannelDelete = async (channelId: string) => {
  const data = await redis.getdel(redisVoiceOwnerKey(channelId))
  if (data) {
    const guild = await currentGuild()
    await guild.channels.delete(channelId)
  }
}

export const voiceChannelState = async (channel: VoiceChannel) => {
  const userRole = await getSetting('userRole')
  const owner = (await redis.get(redisVoiceOwnerKey(channel.id))) ?? ''
  const members = await Promise.all(
    channel.permissionOverwrites.cache
      .filter(({ type }) => type === OverwriteType.Member)
      .map(async ({ id }) => {
        const member = await currentGuildMember(id)
        return member
      }),
  )
  if (!userRole) return { isPrivate: false, members, owner }
  if (channel.permissionsLocked) return { isPrivate: false, members, owner }
  return { isPrivate: true, members, owner }
}

export const voiceChannelVisible = async (channel: VoiceChannel, toggle: boolean) => {
  const userRole = await getSetting('userRole')
  if (!userRole) return

  // Turn On
  if (toggle) {
    await channel.setName(`[비공개] ${channel.name}`)
    await channel.permissionOverwrites.cache.get(userRole)?.edit({
      ViewChannel: false,
      Connect: false,
      Speak: false,
    })

    return
  }

  // Turn Off
  channel.lockPermissions()
  await channel.setName(channel.name.replace(/^\[비공개\] /, ''))
}

export const voiceChannelAllow = async (channel: VoiceChannel, memberIds: string[]) => {
  for (const id of memberIds) {
    await channel.permissionOverwrites.create(id, {
      ViewChannel: true,
      Connect: true,
      Speak: true,
    })
  }
}

export const voiceChannelDeny = async (channel: VoiceChannel, memberIds: string[]) => {
  for (const id of memberIds) {
    await channel.permissionOverwrites.delete(id)
  }
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

  const owner = (await redis.get(redisVoiceOwnerKey(interaction.channelId))) ?? ''
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

export const voiceChannelClaim = async (channel: VoiceChannel, member: GuildMember) => {
  const currentOwner = await redis.get(redisVoiceOwnerKey(channel.id))
  if (currentOwner && channel.members.get(currentOwner)) return false
  await redis.set(redisVoiceOwnerKey(channel.id), member.id, 'EX', redisVoiceOwnerExpire)
  return true
}
