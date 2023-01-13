import type { AppProps } from 'next/app'
import { TooltipProvider } from 'react-tooltip'

import { trpc } from '~/lib/trpc'

import '../styles/globals.scss'
import 'react-tooltip/dist/react-tooltip.css'
import '../styles/tooltip.scss'

function App({ Component, pageProps }: AppProps) {
  return (
    <TooltipProvider>
      <Component {...pageProps} />
    </TooltipProvider>
  )
}

export default trpc.withTRPC(App)
