import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import superjson from 'superjson'

export type AppRouter = typeof appRouter

const t = initTRPC.create({
  transformer: superjson,
})

const publicProcedure = t.procedure
const router = t.router

const appRouter = router({
  hello: publicProcedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val
      throw new Error(`Invalid input: ${typeof val}`)
    })
    .query(({ input }) => ({ greeting: `hello, ${input}!` })),
})

console.log('Create HTTPS Server')
createHTTPServer({
  router: appRouter,
  createContext() {
    return {}
  },
}).listen(2022)
