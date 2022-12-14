import { router, publicProcedure } from '~/api/trpc'
import { authLoginWithPinValidator } from '@ideaslab/validator'
import { loginWithPin } from '~/service/auth'

export const authRouter = router({
  loginWithPin: publicProcedure
    .input(authLoginWithPinValidator)
    .mutation(async ({ ctx, input }) => {
      const token = await loginWithPin(input.pin)
      return {
        token,
      }
    }),
})
