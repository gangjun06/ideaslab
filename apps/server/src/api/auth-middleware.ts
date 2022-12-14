import { TRPCError } from '@trpc/server'
import { middleware, publicProcedure } from './trpc'

const checkAuth = middleware(async ({ next, ctx }) => {
  if (typeof ctx.user?.id === 'string') {
    return next({ ctx })
  }

  throw new TRPCError({
    code: 'UNAUTHORIZED',
  })
})

export const loginedProcedure = publicProcedure.use(checkAuth)
