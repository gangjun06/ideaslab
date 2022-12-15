import { TRPCError } from '@trpc/server'
import { middleware, publicProcedure } from './trpc'

const checkAuth = middleware(async ({ next, ctx }) => {
  if (ctx.user === 'invalid')
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: {
        reason: 'invalid-token',
      },
    })

  if (ctx.user) {
    return next({
      ctx: {
        ...ctx,
        user: {
          ...ctx.user,
        },
      },
    })
  }

  throw new TRPCError({
    code: 'UNAUTHORIZED',
  })
})

export const loginedProcedure = publicProcedure.use(checkAuth)
