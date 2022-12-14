import { router, publicProcedure } from '~/api/trpc'

export const authRouter = router({
  hello: publicProcedure.query(() => {
    // ...
    return []
  }),
})
