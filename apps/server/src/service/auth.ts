import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import config from '~/config'
import { redis } from '~/lib/redis'

const loginTokenExpire = 60 * 10 // 10 minutes
const authTokenExpire = 60 * 60 * 24 * 30 // 30 days

const redisLoginPinKey = (pin: string) => `${config.redisPrefix}loginPin:${pin}`

const randomNumber = (length: number) => {
  const min = 10 ** (length - 1)
  const max = 10 ** length - 1

  return Math.floor(Math.random() * (max - min + 1)) + min
}

const createAuthToken = (userId: string, isAdmin: boolean) => {
  const token = jwt.sign({ isAdmin }, config.jwtSecret, {
    issuer: 'ideaslab',
    subject: userId,
    expiresIn: authTokenExpire,
  })

  return token
}

const generatePin = async (): Promise<string> => {
  const pin = `${randomNumber(6)}`

  if ((await redis.get(redisLoginPinKey(pin))) !== null) {
    const newPin = generatePin()
    return newPin
  }
  return pin
}

/**
 * create JWT Token for login
 * @param userId discord user's id
 */
export const getLoginToken = async (
  userId: string,
  name: string,
  avatar: string,
  isAdmin: boolean,
): Promise<{ token: string; pin: string }> => {
  const pin = await generatePin()

  await redis.set(
    redisLoginPinKey(pin),
    JSON.stringify({ userId, isAdmin }),
    'EX',
    loginTokenExpire,
  )

  const token = jwt.sign({ name, avatar, isAdmin }, config.jwtSecret, {
    issuer: 'ideaslab',
    subject: userId,
    expiresIn: loginTokenExpire,
  })

  return { token, pin }
}

/**
 * create authorized JWT Token with loginPin
 * @param pin pin code witch generated in getLoginToken
 */
export const loginWithPin = async (pin: string) => {
  const userData = await redis.get(redisLoginPinKey(pin))
  if (userData === null) return null
  const { userId, isAdmin } = JSON.parse(userData) as { userId: string; isAdmin: boolean }

  return createAuthToken(userId, isAdmin)
}

/**
 * create authorized JWT Token with loginToken
 * @param loginToken jwt token which generated in getLoginToken
 */
export const loginWithToken = (loginToken: string) => {
  try {
    const { sub: userId, isAdmin } = jwt.verify(loginToken, config.jwtSecret) as {
      sub: string
      isAdmin: boolean
    }

    return createAuthToken(userId, isAdmin)
  } catch {
    return null
  }
}

/**
 * verify authorized JWT Token for isLogin
 * @param loginToken auth jwt token which generated in loginWithToken or loginWithPin
 */
export const verifyAuthToken = (token: string) => {
  try {
    const { sub: userId, isAdmin } = jwt.verify(token, config.jwtSecret) as {
      sub: string
      isAdmin: boolean
    }

    return { id: userId, isAdmin }
  } catch (error) {
    return null
  }
}
