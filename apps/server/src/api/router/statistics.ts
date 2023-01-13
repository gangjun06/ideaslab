import { statisticsVoiceLogValidator } from '@ideaslab/validator'

import { verifiedProcedure } from '~/api/base/auth-middleware'
import { router } from '~/api/base/trpc'
import { allVoiceLogByDate } from '~/service/voice-log'

export const statisticsRouter = router({
  basic: verifiedProcedure.query(async ({ ctx, input }) => {}),
  voiceLog: verifiedProcedure.input(statisticsVoiceLogValidator).query(async ({ ctx, input }) => {
    const { startMonth, startYear, endMonth, endYear } = input
    const result = await allVoiceLogByDate(ctx.session.id, {
      endMonth,
      endYear,
      startMonth,
      startYear,
    })
    return result
  }),
})
