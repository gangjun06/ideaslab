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

type ConfigType = ReturnType<Parameters<typeof createTRPCNext>[0]['config']>

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    const config: Pick<ConfigType, 'queryClientConfig'> = {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              if ((error as any)?.data?.code === 'UNAUTHORIZED') return false
              if (failureCount < 2) return true
              return false
            },
          },
        },
        logger: {
          log: console.log,
          warn: console.warn,
          error(...args) {
            if (args[0]?.data?.code === 'FORBIDDEN' || args[0]?.data?.code === 'UNAUTHORIZED')
              return
            console.error(...args)
          },
        },
      },
    }
    // Client request
    if (typeof window !== 'undefined') {
      return {
        transformer: superjson,
        links: [
          httpBatchLink({
            url: getBaseUrl(false),
          }),
        ],
        ...config,
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
      ...config,
    }
  },
  ssr: true,
})
