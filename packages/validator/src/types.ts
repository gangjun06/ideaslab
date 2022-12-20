import { z } from 'zod'
import { customErrorMap } from './error-map'

export const authLoginWithPinValidator = z.object({
  pin: z.string().min(6).max(6),
})

export const linkValidator = z.object({
  name: z.string().min(1).max(20),
  url: z.string().url(),
})

export const authCheckHandleValidator = z.object({
  handle: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/)
    .min(3)
    .max(20),
})

export const authSignUpValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9가-힣`~!@#$%^&*()-_=+]+$/),
  handle: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/)
    .min(3)
    .max(20),
  introduce: z.string().min(1).max(300),
  registerFrom: z.string().min(0).max(30),
  captcha: z.string(),
  links: z.array(linkValidator).min(0).max(6),
})

export const adminGallerySettingValidator = z.object({
  categories: z.array(
    z.object({
      id: z.string().cuid().optional(),
      name: z.string().min(1).max(20),
      discordChannel: z.string().min(1).max(20),
      defaultOrder: z.number(),
    }),
  ),
})

z.setErrorMap(customErrorMap)
