import type { AppProps } from 'next/app'
import { TooltipProvider } from 'react-tooltip'

import { trpc } from '~/utils'

import 'react-tooltip/dist/react-tooltip.css'
import 'swiper/css'
import '../styles/globals.scss'

import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/effect-fade'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'

function App({ Component, pageProps }: AppProps) {
  return (
    // @ts-expect-error - deprecated
    <TooltipProvider>
      <Component {...pageProps} />
    </TooltipProvider>
  )
}

export default trpc.withTRPC(App)
