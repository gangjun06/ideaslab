import { router, publicProcedure } from '~/api/trpc'
import { adminGallerySettingValidator } from '@ideaslab/validator'
import { loginWithPin } from '~/service/auth'
import { adminProcedure, loginedProcedure } from '~/api/auth-middleware'
import { client, currentGuild, currentGuildMember } from '~/bot/client'
import { prisma } from '@ideaslab/db'

export const adminRouter = router({
  loadGallerySetting: adminProcedure.query(async ({ ctx }) => {
    const categories = await prisma.category.findMany()
    return {
      categories,
    }
  }),
  gallerySetting: adminProcedure.input(adminGallerySettingValidator).mutation(async ({ ctx }) => {
    const members = (await currentGuild()).memberCount

    return {
      memberCount: members,
    }
  }),
})
