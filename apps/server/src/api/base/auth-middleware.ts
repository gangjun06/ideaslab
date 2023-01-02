import { TRPCError } from '@trpc/server'

import { middleware, publicProcedure } from './trpc'

const checkAuth = middleware(async ({ next, ctx }) => {
  if (!ctx.session.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: {
        reason: 'invalid-session',
      },
    })
  }

  return next({
    ctx,
  })
})

const checkAdmin = middleware(async ({ next, ctx }) => {
  if (!ctx.session.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: {
        reason: 'invalid-session',
      },
    })
  }
  if (!ctx.session.isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      cause: {
        reason: 'invalid-permission',
      },
    })
  }

  return next({
    ctx,
  })
})

export const loginedProcedure = publicProcedure.use(checkAuth)
export const adminProcedure = publicProcedure.use(checkAdmin)
