import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'

import { AppRouter } from '@ideaslab/server/app'

const getBaseUrl = (isServer: boolean) => {
  if (isServer) {
    return `${process.env.BACKEND_URL}`
  }
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}`
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    // Client request
    if (typeof window !== 'undefined') {
      return {
        transformer: superjson,
        links: [
          httpBatchLink({
            url: getBaseUrl(false),
          }),
        ],
      }
    }
    // SSR
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl(true)}`,
          headers() {
            if (ctx?.req) {
              const { connection: _connection, ...headers } = ctx.req.headers
              return {
                ...headers,
                'x-ssr': '1',
              }
            }
            return {}
          },
        }),
      ],
    }
  },
  ssr: true,
})
