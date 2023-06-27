import { VoiceChannel } from 'discord.js'

import { dbClient } from '@ideaslab/db'

import { currentGuildChannel } from '~/bot/base/client'

import { getSetting } from './setting'

const chatTimeMap = new Map<string, number>()

export const pointService = {
  async get(memberId: string) {
    const points = await dbClient.point.aggregate({
      where: {
        userId: memberId,
      },
      _sum: {
        value: true,
      },
    })

    return points
  },
  async manual(memberId: string, point: number, reason: string, type = 'manual') {
    await dbClient.point.create({
      data: {
        userId: memberId,
        type,
        value: point,
        date: new Date(),
        reason,
      },
    })
  },
  async event(
    memberId: string,
    type: 'chat-general' | 'chat-voice' | 'thread-create' | 'gallery-create',
  ) {
    const lastChatTime = chatTimeMap.get(memberId) || 0 // 1000
    const now = Date.now() // 1500

    // 30초 이내에 채팅을 치면 포인트를 주지 않음
    if (type !== 'thread-create' && type !== 'gallery-create' && lastChatTime > now - 30 * 1000)
      return

    const value = {
      'chat-general': 2,
      'chat-voice': 0.5,
      'thread-create': 10,
      'gallery-create': 15,
    }[type]

    chatTimeMap.set(memberId, now)
    await dbClient.point.create({
      data: {
        userId: memberId,
        type: `${type}`,
        value: value,
        date: new Date(),
        reason: '',
      },
    })
  },
  //  1주차 이벤트: 선착순 점수 획득 1등 50점 2등 20점 3등 20점
  async eventWeek1() {
    await new Promise((resolve) => setTimeout(resolve, 1000 * 10))
    console.log('----- START EVENT WEEK 1 -----')
    const welcomeChannel = await getSetting('welcomeChannel')
    if (!welcomeChannel) return
    const now = new Date()

    {
      const nowNumber = now.getTime()
      const start = new Date('2023-06-26')
      start.setHours(0, 0, 0, 0)
      const end = new Date('2023-07-02')
      end.setHours(23, 59, 59, 999)
      if (nowNumber < start.getTime() || nowNumber > end.getTime()) return
    }

    console.log('----- START EVENT WEEK 1 -----')

    const channel = (await currentGuildChannel(welcomeChannel)) as VoiceChannel
    await channel.send(`# 선착순 이벤트가 시작되었습니다!
    - 이벤트 1주차 오후 9시에 진행됩니다
    - 선착순으로 채팅을 입력하는사람이 포인트를 얻게됩니다
      - 1등 - 50점
      - 2등 - 20점
      - 3등 - 15점`)

    const already = new Set<string>()

    const collector = channel.createMessageCollector({ time: 1000 * 60 * 60 * 1 })
    collector.on('collect', async (message) => {
      if (message.author.bot) return
      if (already.has(message.author.id)) return
      already.add(message.author.id)
      if (already.size === 1) {
        await message.reply('1등! 50점 획득!')
        await pointService.manual(message.author.id, 50, '1st', 'event1')
      } else if (already.size === 2) {
        await message.reply('2등! 20점 획득!')
        await pointService.manual(message.author.id, 20, '2nd', 'event1')
      } else if (already.size === 3) {
        await message.reply('3등! 15점 획득!')
        await pointService.manual(message.author.id, 15, '3rd', 'event1')
        collector.stop()
      }
    })

    collector.on('end', async () => {
      await channel.send(`# 선착순 이벤트가 종료되었습니다!`)
    })
  },
}
