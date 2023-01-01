import { inferAsyncReturnType } from '@trpc/server'
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http'

import config from '~/config'
import { verifyAuthToken } from '~/service/auth'

import { IncomingMessage, ServerResponse } from 'http'
import { getIronSession, IronSessionOptions } from 'iron-session'

export const sessionOptions: IronSessionOptions = {
  password: config.ironSessionPassword ?? '',
  cookieName: 'ideas-lab/session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export async function createContext({
  req,
  res,
}: NodeHTTPCreateContextFnOptions<IncomingMessage, ServerResponse<IncomingMessage>>) {
  const getUserFromHeader = async (): Promise<'invalid' | ReturnType<typeof verifyAuthToken>> => {
    if (req.headers.authorization) {
      const splited = req.headers.authorization.split(' ')
      if (splited.length !== 2) return null
      if (splited[0] !== 'Bearer') return null

      const user = verifyAuthToken(req.headers.authorization.split(' ')[1])
      if (!user) return 'invalid'
      //@ts-ignore
      if (user.avatar) return 'invalid'
      return { ...user }
    }
    return null
  }
  const user = await getUserFromHeader()
  const session = await getIronSession(req, res, sessionOptions)

  return {
    user,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
