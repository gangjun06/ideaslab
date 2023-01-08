import { inferAsyncReturnType } from '@trpc/server'
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http'
import { IncomingMessage, ServerResponse } from 'http'
import { getIronSession, IronSessionOptions } from 'iron-session'

import config from '~/config'

export const sessionOptions: IronSessionOptions = {
  password: config.ironSessionPassword ?? '',
  cookieName: 'ideas-lab/session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: process.env.NODE_ENV === 'production' ? false : true,
    domain: config.webURL.replace(/https?:\/\//, '').replace(/:\d+$/, ''),
  },
}

declare module 'iron-session' {
  interface IronSessionData {
    id?: string
    isAdmin?: boolean
    verified?: boolean
  }
}

export async function createContext({
  req,
  res,
}: NodeHTTPCreateContextFnOptions<IncomingMessage, ServerResponse<IncomingMessage>>) {
  const session = await getIronSession(req, res, sessionOptions)

  return {
    session,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
