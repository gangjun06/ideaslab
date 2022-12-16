import { router, publicProcedure } from '~/api/trpc'
import { authLoginWithPinValidator } from '@ideaslab/validator'
import { loginWithPin } from '~/service/auth'
import { loginedProcedure } from '~/api/auth-middleware'
import { client, currentGuild, currentGuildMember } from '~/bot/client'
import { prisma } from '@ideaslab/db'

export const infoRouter = router({
  stat: publicProcedure.query(async ({ ctx }) => {
    const members = (await currentGuild()).memberCount

    return {
      memberCount: members,
    }
  }),
})
