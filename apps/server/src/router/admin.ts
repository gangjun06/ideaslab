import { router, publicProcedure } from '~/api/trpc'
import { adminGallerySettingValidator, adminSaveSettingsValidator } from '@ideaslab/validator'
import { loginWithPin } from '~/service/auth'
import { adminProcedure, loginedProcedure } from '~/api/auth-middleware'
import { client, currentGuild, currentGuildMember } from '~/bot/client'
import { prisma } from '@ideaslab/db'
import { getAllSettings, setSetting } from '~/service/setting'

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
  loadSettings: adminProcedure.query(async ({ ctx }) => {
    return await getAllSettings()
  }),
  saveSettings: adminProcedure
    .input(adminSaveSettingsValidator)
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.settings.map((setting) =>
          setting.value ? setSetting(setting.key as any, setting.value) : () => {},
        ),
      )
      return
    }),
})
