import { router, publicProcedure } from '~/api/trpc'
import {
  authCheckHandleValidator,
  authLoginWithPinValidator,
  authSignUpValidator,
  authUpdateProfileValidator,
} from '@ideaslab/validator'
import { loginWithPin } from '~/service/auth'
import { loginedProcedure } from '~/api/auth-middleware'
import { client, currentGuild, currentGuildMember } from '~/bot/client'
import { dbClient } from '@ideaslab/db'
import axios from 'axios'
import config from '~/config'
import { TRPCError } from '@trpc/server'
import { getSetting } from '~/service/setting'
import { ChannelType } from 'discord.js'
import { Embed } from '~/utils/embed'

export const authRouter = router({
  loginWithPin: publicProcedure
    .input(authLoginWithPinValidator)
    .mutation(async ({ ctx, input }) => {
      const token = await loginWithPin(input.pin)
      return {
        token,
      }
    }),
  profile: loginedProcedure.query(async ({ ctx }) => {
    const user = await dbClient.user.findUnique({
      where: { discordId: ctx.user.id },
      select: { discordId: true, avatar: true, roles: true, introduce: true, links: true },
    })

    const member = await currentGuildMember(ctx.user.id)
    const name = member.displayName
    const avatar = member.displayAvatarURL()
    const username = member.user.username
    const discriminator = member.user.discriminator

    if (user && user.avatar !== avatar) {
      try {
        await dbClient.user.update({
          where: { discordId: ctx.user.id },
          data: {
            avatar,
          },
        })
      } catch {}
    }

    return {
      userId: ctx.user.id,
      isAdmin: ctx.user.isAdmin,
      name,
      avatar,
      username,
      discriminator,
      roles: user?.roles,
      introduce: user?.introduce,
      isVerified: user ? true : false,
      links: user?.links,
    }
  }),
  checkHandle: publicProcedure.input(authCheckHandleValidator).mutation(async ({ input }) => {
    const user = await dbClient.user.findUnique({
      where: { handle: input.handle },
    })
    if (user) return false
    return true
  }),
  signup: loginedProcedure.input(authSignUpValidator).mutation(async ({ ctx, input }) => {
    const res = await axios.post(
      'https://hcaptcha.com/siteverify',
      `response=${input.captcha}&secret=${config.hCaptchaSecretKey}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
      },
    )

    if (res.data.success === false) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: '캡챠 인증에 실패하였습니다.' })
    }

    const user = await dbClient.user.findUnique({
      where: { discordId: ctx.user.id },
    })
    if (user) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: '이미 가입되어 있습니다.' })
    }

    const member = await currentGuildMember(ctx.user.id)

    if (member.displayName !== input.name) {
      member.setNickname(input.name)
    }

    await dbClient.user.create({
      data: {
        discordId: ctx.user.id,
        avatar: member.displayAvatarURL(),
        name: input.name,
        handle: input.handle,
        introduce: input.introduce,
        registerFrom: input.registerFrom,
        roles: { connect: input.roles.map((id) => ({ id })) },
      },
    })

    const welcomeChannelId = await getSetting('welcomeChannel')
    const welcomeChannel = welcomeChannelId ? client.channels.cache.get(welcomeChannelId) : null
    const welcomeMessage = await getSetting('welcomeMessage')

    if (welcomeChannel && welcomeChannel.type === ChannelType.GuildText) {
      const embed = new Embed(client, 'info')
        .setTitle('새로운 유저가 서버에 참여했어요!')
        .setDescription(welcomeMessage ?? '')
        .addFields({
          name: '자기소개',
          value: `${input.introduce}${input.links.length > 0 ? '\n\n' : ''}${input.links.map(
            ({ name, url }) => `[${name}](${url})`,
          )}`,
        })
        .setAuthor({
          name: input.name,
          iconURL: member.displayAvatarURL(),
          url: `https://ideaslab.kr/@${input.handle}`,
        })
      await welcomeChannel.send({ embeds: [embed] })
    }

    return {
      success: true,
    }
  }),
  updateProfile: loginedProcedure
    .input(authUpdateProfileValidator)
    .mutation(async ({ ctx, input }) => {
      const user = await dbClient.user.findUnique({
        where: { discordId: ctx.user.id },
      })
      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '가입되어있지 않은 유저의 요청입니다.',
        })
      }

      const member = await currentGuildMember(ctx.user.id)

      if (member.displayName !== input.name) {
        member.setNickname(input.name)
      }

      await dbClient.user.update({
        where: {
          discordId: ctx.user.id,
        },
        data: {
          discordId: ctx.user.id,
          avatar: member.displayAvatarURL(),
          name: input.name,
          handle: input.handle,
          introduce: input.introduce,
          links: input.links,
          roles: { connect: input.roles.map((id) => ({ id })) },
        },
      })

      return {
        success: true,
      }
    }),
})
