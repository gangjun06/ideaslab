import { dbClient } from '@ideaslab/db'
import {
  adminGallerySettingValidator,
  adminRoleSettingValidator,
  adminSaveSettingsValidator,
} from '@ideaslab/validator'

import { adminProcedure } from '~/api/base/auth-middleware'
import { router } from '~/api/base/trpc'
import { getAllSettings, setSetting } from '~/service/setting'

export const adminRouter = router({
  loadGallerySetting: adminProcedure.query(async () => {
    const categories = await dbClient.category.findMany()
    return {
      categories,
    }
  }),
  gallerySetting: adminProcedure.input(adminGallerySettingValidator).mutation(async ({ input }) => {
    for (const category of input.categories) {
      if (category.delete) {
        await dbClient.category.delete({ where: { id: category.id } })
      }

      if (!category.id) {
        await dbClient.category.create({
          data: {
            name: category.name,
            discordChannel: category.discordChannel,
            defaultOrder: category.defaultOrder,
          },
        })
        continue
      }

      await dbClient.category.update({
        where: { id: category.id },
        data: {
          name: category.name,
          discordChannel: category.discordChannel,
          defaultOrder: category.defaultOrder,
        },
      })
    }
  }),
  loadRoles: adminProcedure.query(async () => {
    return await dbClient.role.findMany()
  }),
  saveRoles: adminProcedure.input(adminRoleSettingValidator).mutation(async ({ input }) => {
    for (const role of input.roles) {
      if (role.delete) {
        await dbClient.role.delete({ where: { id: role.id } })
      }

      const { name, discordRole, defaultOrder } = role

      if (!role.id) {
        await dbClient.role.create({
          data: {
            name,
            discordRole,
            defaultOrder,
          },
        })
        continue
      }

      await dbClient.role.update({
        where: { id: role.id },
        data: {
          name,
          discordRole,
          defaultOrder,
        },
      })
    }
  }),
  loadSettings: adminProcedure.query(async () => {
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
