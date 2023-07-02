import { VoiceChannel } from 'discord.js'

import { dbClient, Prisma } from '@ideaslab/db'

import { client, currentGuildChannel } from '~/bot/base/client'
import { Embed } from '~/utils/embed'

import { getSetting } from './setting'

const chatTimeMap = new Map<string, number>()

const EventQuiz = [
  [
    ['단답형 문제 - 올해 아이디어스 랩은 몇 주년을 맞이했을까요? `!N주년`', '3주년'],
    ['OX 문제 - 아이디어스 랩 3주년 행사는 합정역 주변에서 한다. `!O/X`', 'O'],
  ],
  [
    ['단답형 문제 - 아이디어스 랩 서버 설립일은 2020년 07월 XX일이다. XX의 답은? `!XX`', '28'],
    [
      'OX 문제 - 아이디어스 랩은 게임 디자인 워크숍이라는 책에서 영감받아 만들어진 서버다. `!O/X`',
      'O',
    ],
  ],
  [
    [
      '단답형 문제 - 아이디어스 랩은 SNS 하나를 운영하고 있습니다. 그 SNS의 이름은? `!XXXXX`',
      '인스타그램',
    ],
    ['OX 문제 - 아이디어스 랩 사이트는 ideaslab.co.kr 주소로 되어있다. `!O/X`', 'X'],
  ],
  [
    ['단답형 문제 - 아이디어스 랩의 창작 역할은 총 몇개일까요? `!N개`', '10개'],
    ['OX 문제 - 아이디어스 랩 로고는 한번도 바뀐 적이 없다(만우절 제외) `!O/X`', 'X'],
  ],
  [
    [
      '단답형 문제 - 그 외 건의하고 싶은 사항이나 궁금하신게 있으시면 @<아이디어스랩> 0000으로 보내주세요! 0000의 답은? (힌트: 공지를 확인하세요) `!XXXX`',
      '개인디엠',
    ],
    ['OX 문제 - 아이디어스 랩의 모토는 “당신의 아이디어가 현실로 이루어지길”이다. `!O/X`', 'O'],
  ],
  [
    ['단답형 문제 - 아이디어스 랩 관리진은 몇명일까요? `!N명`', '4명'],
    ['OX 문제 - 아이디어스 랩 로고는 어도비 일러스트레이터로 만들어졌다. `!O/X`', 'O'],
  ],
  [
    ['단답형 문제 - 아이디어스 랩에서 가장 많은 창작 역할군은? `!역할이름`', '아트 디자이너'],
    ['OX 문제 - 강준님이 아이디어스 랩에서 처음 만든 봇은 아직까지도 서버에 남아있다. `!O/X`', 'X'],
  ],
]

const EventAlert = (n: number) => `
# ${n}차 퀴즈 이벤트가 시작되었습니다!
- 이벤트 2주차에는 매일 단답형(9시)과 OX퀴즈(10시)가 **15**분씩 진행됩니다.
- 정답을 맞춘 사람 모두에게 포인트가 지급됩니다. (단답형 20점, OX 퀴즈 10점)
  - 처음 맞춘 사람은 2배의 점수를 얻습니다.
- 정답을 외챌때는 \`!<정답>\` 형식으로 보내주세요. (ex: \`!0주년\`)
  - 마지막으로 보낸 정답만 인정됩니다.
`

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
  async rankUser(memberId: string) {
    const result = (await dbClient.$queryRaw(
      Prisma.sql`WITH UserPoints AS (
        SELECT "userId", SUM("value") AS total_points
        FROM "public"."Point"
        GROUP BY "userId"
      ), TotalUsers AS (
        SELECT COUNT(*) AS total_users
        FROM UserPoints
      )

      SELECT 'member_count' as label, t."total_users" as value FROM TotalUsers as t

      UNION

      SELECT 'rank' as label, COUNT(*) + 1 AS value
      FROM UserPoints
      WHERE total_points > (SELECT total_points FROM UserPoints WHERE "userId" = '${memberId}'::text)`,
    )) as { label: string; value: bigint }[]
    console.log(result)
    const rank = Number(result.find((item) => item.label === 'rank')?.value ?? 0n)
    const memberCount = Number(result.find((item) => item.label === 'member_count')?.value ?? 0n)
    console.log(rank, memberCount)
    return { rank, percent: Math.ceil(Math.floor((rank / memberCount) * 100) / 5) * 5 }
  },
  async rank() {
    const ranking = await dbClient.point.groupBy({
      by: ['userId'],
      _sum: {
        value: true,
      },
      orderBy: {
        _sum: {
          value: 'desc',
        },
      },
      take: 10,
    })
    return ranking.map((item) => ({ userId: item.userId, value: item._sum.value ?? 0 }))
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
  async eventWeek2(index = 0) {
    const welcomeChannel = await getSetting('welcomeChannel')
    if (!welcomeChannel) return
    const channel = (await currentGuildChannel(welcomeChannel)) as VoiceChannel

    const now = new Date()
    const questionNumber = now.getDay()

    const question = EventQuiz[questionNumber]

    const questionTime = 1000 * 60 * 15 // 5분

    await channel.send(`${EventAlert(index + 1)}\n## ${question[index][0]}`)
    const collector = channel.createMessageCollector({ time: questionTime })

    const list: [string, string][] = []

    collector.on('collect', async (message) => {
      if (message.content.startsWith('!')) {
        const content = message.content.slice(1)
        await message.react('✅')
        list.push([message.author.id, content])
      }
    })

    collector.on('end', async () => {
      const lastAnswer = new Map<string, string>()
      list.reverse().forEach(([userId, answer]) => {
        if (!lastAnswer.has(userId)) lastAnswer.set(userId, answer)
      })
      const corrects = Array.from(lastAnswer)
        .reverse()
        .filter(([, answer]) => answer === question[index][1])

      if (corrects[0]) {
        await dbClient.point.createMany({
          data: corrects.map(([userId]) => ({
            userId,
            type: `event2-${questionNumber}-${index}`,
            value: userId === corrects[0][0] ? 40 : 10,
            reason: '',
          })),
        })
      }

      const others = corrects
        .filter(([userId]) => corrects[0][0] !== userId)
        .map(([userId]) => `<@${userId}>`)
        .join(', ')

      const embed = new Embed(client, 'info')
        .setTitle(`퀴즈 이벤트 ${index === 0 ? '단답형' : 'OX'} 결과`)
        .setDescription(
          `**퀴즈 : **${question[index][0]}\n\n**정답:**\n\`\`\`${question[index][1]}\n\`\`\`
          ${index === 0 ? '**잠시후 9시에 OX퀴즈가 시작됩니다**' : ''}`,
        )
        .addFields([
          {
            name: '1등',
            value: corrects[0]
              ? `<@${corrects[0][0]}> :partying_face: :partying_face:`
              : '정답자가 없어요 :cry:',
          },
          ...(others.length > 0 ? [{ name: '정답자', value: others }] : []),
        ])

      await channel.send({ embeds: [embed] })
    })
  },
}
