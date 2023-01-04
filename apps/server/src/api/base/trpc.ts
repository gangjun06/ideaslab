import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

import { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const middleware = t.middleware
export const publicProcedure = t.procedure
export const router = t.router
