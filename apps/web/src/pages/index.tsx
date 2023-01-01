import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { MainLayout } from '../layouts'

const HomePage = dynamic(() => import('../components/pages/Home').then((d) => d.HomePage), {
  ssr: false,
})

const Home: NextPage = () => {
  return (
    <MainLayout title="">
      <HomePage />
    </MainLayout>
  )
}

export default Home
