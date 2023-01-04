import { ChannelType } from 'discord.js'

import { dbClient } from '@ideaslab/db'
import { infoProfilesValidator } from '@ideaslab/validator'

import { publicProcedure, router } from '~/api/base/trpc'
import { currentGuild } from '~/bot/base/client'
import { getSetting } from '~/service/setting'

type Channel = {
  id: string
  name: string
  parentId: string | null
  type: ChannelType
}

type Role = {
  id: string
  name: string
  color: string
  position: number
}

export const infoRouter = router({
  stat: publicProcedure.query(async () => {
    const members = (await currentGuild()).memberCount

    return {
      memberCount: members,
    }
  }),
  channels: publicProcedure.query(async () => {
    const guild = await currentGuild()

    const channels = await guild.channels.fetch()
    if (!channels) return []

    const guildChannelList: Channel[] = []

    channels.forEach((d) => {
      if (
        d?.type === ChannelType.GuildText ||
        d?.type === ChannelType.GuildForum ||
        d?.type === ChannelType.GuildCategory ||
        d?.type === ChannelType.GuildVoice
      ) {
        guildChannelList.push({
          id: d.id,
          name: d.name,
          parentId: d.parentId,
          type: d.type,
        })
      }
    })

    return guildChannelList
  }),
  roles: publicProcedure.query(async () => {
    const guild = await currentGuild()

    const roles = await guild.roles.fetch()
    if (!roles) return []

    const result: Role[] = roles.map(({ id, hexColor, name, position }) => ({
      id,
      color: hexColor,
      name,
      position,
    }))

    return result
  }),
  privacyPolicy: publicProcedure.query(async () => {
    return await getSetting('privacyPolicy')
  }),
  serverRule: publicProcedure.query(async () => {
    return await getSetting('serverRule')
  }),
  serviceInfo: publicProcedure.query(async () => {
    return await getSetting('serviceInfo')
  }),
  artistRoles: publicProcedure.query(async () => {
    return await dbClient.role.findMany({
      select: { id: true, name: true, defaultOrder: true },
      orderBy: { defaultOrder: 'asc' },
    })
  }),
  profiles: publicProcedure.input(infoProfilesValidator).query(async ({ input }) => {
    const { cursor, limit, orderBy, roles } = input
    if (orderBy === 'recentActive') {
      const result = await dbClient.post.findMany({
        distinct: ['authorId'],
        orderBy: {
          createdAt: 'desc',
        },
        ...(cursor
          ? {
              cursor: {
                discordId: cursor,
              },
              skip: 1,
            }
          : {}),
        take: limit,
        ...(roles &&
          roles.length > 0 && {
            where: {
              author: {
                roles: {
                  some: {
                    id: {
                      in: roles,
                    },
                  },
                },
              },
            },
          }),
        select: {
          author: {
            select: {
              discordId: true,
              handle: true,
              name: true,
              avatar: true,
              createdAt: true,
              introduce: true,
              links: true,
              roles: {
                select: {
                  id: true,
                  name: true,
                },
                orderBy: {
                  defaultOrder: 'asc',
                },
              },
              _count: {
                select: {
                  posts: true,
                },
              },
            },
          },
        },
      })
      return result.map(({ author }) => author)
    }
    const result = await dbClient.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      ...(cursor
        ? {
            cursor: {
              discordId: cursor,
            },
            skip: 1,
          }
        : {}),
      take: limit,
      ...(roles &&
        roles.length > 0 && {
          where: {
            roles: {
              some: {
                id: {
                  in: roles,
                },
              },
            },
          },
        }),
      select: {
        discordId: true,
        handle: true,
        name: true,
        avatar: true,
        createdAt: true,
        introduce: true,
        links: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            defaultOrder: 'asc',
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })
    return result
  }),
})
