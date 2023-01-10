import { TRPCError } from '@trpc/server'
import { IronSession } from 'iron-session'

import { middleware, publicProcedure } from './trpc'

const checkAuth = (type: 'admin' | 'logined' | 'verified' | 'unverified') =>
  middleware(async ({ next, ctx }) => {
    if (
      ctx.session.id === undefined ||
      ctx.session.isAdmin === undefined ||
      ctx.session.verified === undefined
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        cause: {
          reason: 'invalid-session',
        },
      })
    }

    switch (type) {
      case 'admin':
        if (!ctx.session.isAdmin)
          throw new TRPCError({
            code: 'FORBIDDEN',
            cause: {
              reason: 'invalid-permission',
            },
          })
        break
      case 'verified':
        if (!ctx.session.verified)
          throw new TRPCError({
            code: 'FORBIDDEN',
            cause: {
              reason: 'invalid-permission',
            },
          })
        break
      case 'unverified':
        if (ctx.session.verified)
          throw new TRPCError({
            code: 'FORBIDDEN',
            cause: {
              reason: 'invalid-permission',
            },
          })
        break
      case 'logined':
        break
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session as Required<IronSession>,
      },
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

export const verifiedProcedure = publicProcedure.use(checkAuth('verified'))
export const loginedProcedure = publicProcedure.use(checkAuth('logined'))
export const unverifiedOnlyProcedure = publicProcedure.use(checkAuth('unverified'))
export const adminProcedure = publicProcedure.use(checkAdmin)
