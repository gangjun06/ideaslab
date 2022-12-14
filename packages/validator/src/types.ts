import { z } from 'zod'
import { customErrorMap } from './error-map'

export const authLoginWithPinValidator = z.object({
  pin: z.string().min(6).max(6),
})

z.setErrorMap(customErrorMap)
