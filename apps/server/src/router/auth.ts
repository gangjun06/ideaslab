import { router, publicProcedure } from '~/api/trpc'
import { authLoginWithPinValidator } from '@ideaslab/validator'
import { loginWithPin } from '~/service/auth'
import { loginedProcedure } from '~/api/auth-middleware'
import { client, currentGuild, currentGuildMember } from '~/bot/client'
import { prisma } from '@ideaslab/db'

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
})
