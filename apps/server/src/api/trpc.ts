import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import superjson from 'superjson'

const t = initTRPC.create({
  transformer: superjson,
})

export const middleware = t.middleware
export const publicProcedure = t.procedure
export const router = t.router
