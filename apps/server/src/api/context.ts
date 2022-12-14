import * as trpc from '@trpc/server'
import { inferAsyncReturnType } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http'
import { IncomingMessage, ServerResponse } from 'http'
import { verifyAuthToken } from '~/service/auth'

export async function createContext({
  req,
  res,
}: NodeHTTPCreateContextFnOptions<IncomingMessage, ServerResponse<IncomingMessage>>) {
  const getUserFromHeader = async () => {
    if (req.headers.authorization) {
      const splited = req.headers.authorization.split(' ')
      if (splited.length !== 2) return null
      if (splited[0] !== 'Bearer') return null

      const user = verifyAuthToken(req.headers.authorization.split(' ')[1])
      return user
    }
    return null
  }
  const user = await getUserFromHeader()
  return {
    user,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
