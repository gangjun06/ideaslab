import { publicProcedure, router } from '~/api/trpc'
import { adminRouter } from './admin'
import { authRouter } from './auth'
import { infoRouter } from './info'

export const appRouter = router({
  auth: authRouter,
  info: infoRouter,
  admin: adminRouter,
})

export type AppRouter = typeof appRouter
