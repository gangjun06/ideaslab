import { router, publicProcedure } from '~/api/trpc'
import {
  authCheckHandleValidator,
  authLoginWithPinValidator,
  authSignUpValidator,
} from '@ideaslab/validator'
import { loginWithPin } from '~/service/auth'
import { loginedProcedure } from '~/api/auth-middleware'
import { client, currentGuild, currentGuildMember } from '~/bot/client'
import { prisma } from '@ideaslab/db'
import axios from 'axios'
import config from '~/config'
import { TRPCError } from '@trpc/server'

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
    const user = await prisma.user.findUnique({
      where: { discordId: ctx.user.id },
      select: { discordId: true },
    })

    const member = await currentGuildMember(ctx.user.id)
    const name = member.displayName
    const avatar = member.displayAvatarURL()
    const username = member.user.username
    const discriminator = member.user.discriminator

    return {
      userId: ctx.user.id,
      isAdmin: ctx.user.isAdmin,
      name,
      avatar,
      username,
      discriminator,
      isVerified: user ? true : false,
    }
  }),
  checkHandle: publicProcedure.input(authCheckHandleValidator).mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({
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

    const user = await prisma.user.findUnique({
      where: { discordId: ctx.user.id },
    })
    if (user) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: '이미 가입되어 있습니다.' })
    }

    const member = await currentGuildMember(ctx.user.id)

    await prisma.user.create({
      data: {
        discordId: ctx.user.id,
        avatar: member.displayAvatarURL(),
        name: input.name,
        handle: input.handle,
        introduce: input.introduce,
        registerFrom: input.registerFrom,
      },
    })

    return {
      success: true,
    }
  }),
})
