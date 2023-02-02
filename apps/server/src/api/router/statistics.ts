import { statisticsFocusVoiceLogValidator, statisticsVoiceLogValidator } from '@ideaslab/validator'

import { verifiedProcedure } from '~/api/base/auth-middleware'
import { router } from '~/api/base/trpc'
import { currentGuildMember } from '~/bot/base/client'
import { allVoiceLogByDate, getCurrentVoiceLog, getVoiceLogDetail } from '~/service/voice-log'

export const statisticsRouter = router({
  basic: verifiedProcedure.query(async ({ ctx }) => {
    const member = await currentGuildMember(ctx.session.id)
    if (!member) return null

    return {
      joinAt: member.joinedAt,
    }
  }),
  voiceLog: verifiedProcedure.input(statisticsVoiceLogValidator).query(async ({ ctx, input }) => {
    const { startMonth, startYear, endMonth, endYear } = input
    const result = await allVoiceLogByDate(ctx.session.id, {
      endMonth,
      endYear,
      startMonth,
      startYear,
    })
    const { all, today } = await getCurrentVoiceLog(ctx.session.id)
    return { list: result, all, today }
  }),
  focusVoiceLog: verifiedProcedure
    .input(statisticsFocusVoiceLogValidator)
    .query(async ({ ctx, input }) => {
      return await getVoiceLogDetail(ctx.session.id, input.focusDate)
    }),
})
