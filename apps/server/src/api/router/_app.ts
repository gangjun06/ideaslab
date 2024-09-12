import { router } from '~/api/base/trpc'

import { adminRouter } from './admin.js'
import { authRouter } from './auth.js'
import { galleryRouter } from './gallery.js'
import { infoRouter } from './info.js'
import { statisticsRouter } from './statistics.js'

export const appRouter = router({
  auth: authRouter,
  info: infoRouter,
  admin: adminRouter,
  gallery: galleryRouter,
  statistics: statisticsRouter,
})

export type AppRouter = typeof appRouter
