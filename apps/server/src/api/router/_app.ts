import { router } from '~/api/base/trpc'

import { adminRouter } from './admin'
import { authRouter } from './auth'
import { galleryRouter } from './gallery'
import { infoRouter } from './info'
import { statisticsRouter } from './statistics'

export const appRouter = router({
  auth: authRouter,
  info: infoRouter,
  admin: adminRouter,
  gallery: galleryRouter,
  statistics: statisticsRouter,
})

export type AppRouter = typeof appRouter
