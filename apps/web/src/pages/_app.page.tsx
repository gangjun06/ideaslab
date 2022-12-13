import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from '~/lib/trpc'
import { SessionProvider } from 'next-auth/react'

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
