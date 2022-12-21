import { router, publicProcedure } from '~/api/trpc'
import {
  adminGallerySettingValidator,
  adminRoleSettingValidator,
  adminSaveSettingsValidator,
} from '@ideaslab/validator'
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
  gallerySetting: adminProcedure
    .input(adminGallerySettingValidator)
    .mutation(async ({ ctx, input }) => {
      for (const category of input.categories) {
        if (category.delete) {
          await prisma.category.delete({ where: { id: category.id } })
        }

        if (!category.id) {
          await prisma.category.create({
            data: {
              name: category.name,
              discordChannel: category.discordChannel,
              defaultOrder: category.defaultOrder,
            },
          })
          continue
        }

        await prisma.category.update({
          where: { id: category.id },
          data: {
            name: category.name,
            discordChannel: category.discordChannel,
            defaultOrder: category.defaultOrder,
          },
        })
      }
    }),
  loadRoles: adminProcedure.query(async ({ ctx }) => {
    return await prisma.role.findMany()
  }),
  saveRoles: adminProcedure.input(adminRoleSettingValidator).mutation(async ({ input }) => {
    for (const role of input.roles) {
      if (role.delete) {
        await prisma.role.delete({ where: { id: role.id } })
      }

      const { name, discordRole, defaultOrder } = role

      if (!role.id) {
        await prisma.role.create({
          data: {
            name,
            discordRole,
            defaultOrder,
          },
        })
        continue
      }

      await prisma.role.update({
        where: { id: role.id },
        data: {
          name,
          discordRole,
          defaultOrder,
        },
      })
    }
  }),
  loadSettings: adminProcedure.query(async ({ ctx }) => {
    return await getAllSettings()
  }),
  saveSettings: adminProcedure.input(adminSaveSettingsValidator).mutation(async ({ input }) => {
    await Promise.all(
      input.settings.map((setting) =>
        setting.value ? setSetting(setting.key as any, setting.value) : () => {},
      ),
    )
    return
  }),
})
