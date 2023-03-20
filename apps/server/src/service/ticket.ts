import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  GuildMember,
  Message,
  ThreadAutoArchiveDuration,
} from 'discord.js'

import { client, currentGuildChannel, currentGuildMember } from '~/bot/base/client'
import config from '~/config'
import { redis } from '~/lib/redis'
import { Embed } from '~/utils/embed'

import { getSetting } from './setting'

const redisTicketKey = (by: 'userId' | 'channelId', id: string) =>
  `${config.redisPrefix}ticket:${by}:${id}`

const redisTicketKeyExpire = 60 * 60 * 24 * 7 // 1 week

type TicketRedisValueByUserId = {
  isAnon: boolean
  threadId: string
}
type TicketRedisValueByChannelId = {
  isAnon: boolean
  userId: string
}

const createTicket = async (member: GuildMember, isAnon: boolean, content: string) => {
  const ticketChannel = await getSetting('ticketChannel')
  if (!ticketChannel) return

  const channel = await currentGuildChannel(ticketChannel)
  if (!channel || channel.type !== ChannelType.GuildText) return

  const date = new Date()

  const name = `${isAnon ? '익명' : `${member.displayName}님`}의 티켓 (${date.getFullYear()}. ${
    date.getMonth() + 1
  }. ${date.getDate()}. )`

  const threadChannel = await channel.threads.create({
    name: name,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
  })

  await redis.set(
    redisTicketKey('userId', member.id),
    JSON.stringify({ isAnon, threadId: threadChannel.id } as TicketRedisValueByUserId),
    'EX',
    redisTicketKeyExpire,
  )
  await redis.set(
    redisTicketKey('channelId', threadChannel.id),
    JSON.stringify({ isAnon, userId: member.id } as TicketRedisValueByChannelId),
    'EX',
    redisTicketKeyExpire,
  )

  const embed = new Embed(client, 'info')
    .setTitle(name)
    .setDescription(`새로운 티켓이 생성되었어요.\n\`\`\`\n${content}\n\`\`\``)

  const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel('티켓 닫기')
    .setCustomId('close-support')

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

  await threadChannel.send({ embeds: [embed], components: [row] })
}

const confirmMessageContent = (status: 'canceled' | 'success' | 'wait' | 'time-over') => {
  const row = new ActionRowBuilder<ButtonBuilder>()

  if (status === 'wait') {
    const button0 = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('전송하기')
      .setCustomId('submit-support')
      .setDisabled(status !== 'wait')
    const button1 = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('익명으로 전송하기')
      .setCustomId('submit-anon-support')
      .setDisabled(status !== 'wait')
    row.addComponents(button0, button1)
  }

  // if (status === 'success') {
  //   const button3 = new ButtonBuilder()
  //     .setStyle(ButtonStyle.Primary)
  //     .setLabel('티켓 닫기')
  //     .setCustomId('close-support-user')
  //   row.addComponents(button3)
  // }

  const button2 = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel(
      status === 'canceled'
        ? '취소됨'
        : status === 'success'
        ? '생성됨'
        : status === 'time-over'
        ? '시간 초과'
        : '취소하기',
    )
    .setCustomId('cancel-support')
    .setDisabled(status !== 'wait')

  row.addComponents(button2)

  const embed = new Embed(client, 'info').setDescription(
    '안녕하세요. :wave: 아이디어스 랩 입니다.\n해당 내용으로 익명 건의함을 생성할까요?',
  )

  return {
    embeds: [embed],
    components: [row],
  }
}

const ticketCreateConfirm = async (message: Message) => {
  let status: Parameters<typeof confirmMessageContent>[0] = 'wait'

  const infoMessage = await message.reply(confirmMessageContent(status))

  status = 'time-over'

  const collector = infoMessage.createMessageComponentCollector({
    max: 10,
    componentType: ComponentType.Button,
    filter: (interaction) => interaction.channelId === infoMessage.channelId,
    time: 30_000,
  })
  collector.on('collect', async (interaction) => {
    if (!interaction.isButton()) return
    const isAnonSupport = interaction.customId === 'submit-anon-support'
    if (interaction.customId === 'submit-support' || isAnonSupport) {
      status = 'success'
      collector.emit('end')
      await interaction.deferReply()
      const member = await currentGuildMember(interaction.user.id)
      await createTicket(member, isAnonSupport, message.content)
      await interaction.editReply({
        content: `해당 메시지를 ${
          isAnonSupport ? '익명으로 ' : ''
        }관리자에게 전달했어요. 이 DM에서 이어서 대화를 할 수 있어요.`,
      })
    } else {
      status = 'canceled'
      collector.emit('end')
      await interaction.deferReply()
      await interaction.deleteReply()
    }
  })

  collector.on('end', async (_collected) => {
    await infoMessage.edit(confirmMessageContent(status))
  })
}

export const ticketEventFromDM = async (message: Message) => {
  const member = await currentGuildMember(message.author.id)
  if (!member) {
    await message.reply('먼저 아이디어스 랩에 가입해 주세요.')
    return
  }

  const ticketData: string | null = await redis.get(redisTicketKey('userId', message.author.id))

  if (!ticketData) {
    ticketCreateConfirm(message)
    return
  }

  const { threadId, isAnon }: TicketRedisValueByUserId = JSON.parse(ticketData)

  const channel = await currentGuildChannel(threadId)
  if (channel?.type !== ChannelType.PublicThread) return

  await channel.send({
    content: `> ${isAnon ? '익명' : `${member.displayName} (<@${member.id}>)` ?? '??'}: ${
      message.content
    }`,
  })

  await message.react('✅')
}

export const ticketEventFromThread = async (message: Message) => {
  if (!message.channel.isThread()) return
  const ticketChannelId = await getSetting('ticketChannel')

  if (message.channel.parent?.id !== ticketChannelId) return

  const ticketData: string | null = await redis.get(redisTicketKey('channelId', message.channelId))
  if (!ticketData) {
    message.reply('티켓이 존재하지 않습니다.')
    return
  }

  const { userId }: TicketRedisValueByChannelId = JSON.parse(ticketData)

  const user = await currentGuildMember(userId)
  if (!user || !user.dmChannel) return

  await user.dmChannel.send({
    content: `> ${message.member?.displayName}: ${message.content}`,
  })

  await message.react('✅')
}

export const ticketClose = async (from: 'user' | 'manager', id: string) => {
  if (from === 'user') {
    const data = await redis.getdel(redisTicketKey('userId', id))
    if (!data) return false
    const { threadId } = JSON.parse(data) as TicketRedisValueByUserId
    await redis.del(redisTicketKey('channelId', threadId))

    const channel = await currentGuildChannel(threadId)

    if (!channel) return false
    if (channel.type !== ChannelType.PublicThread) return false

    channel.setArchived(true)

    await channel.send({
      content: '대화가 종료되었습니다.',
    })
    return true
  }

  const data = await redis.getdel(redisTicketKey('channelId', id))
  if (!data) return false
  const { userId } = JSON.parse(data) as TicketRedisValueByChannelId
  await redis.del(redisTicketKey('userId', userId))

  const { dmChannel } = await currentGuildMember(userId)

  if (!dmChannel) return false
  if (!dmChannel.isDMBased()) return false

  await dmChannel.send({
    content: '대화가 종료되었습니다.',
  })

  return true
}
