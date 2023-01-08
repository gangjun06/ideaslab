import type { NextPage } from 'next'
import dynamic from 'next/dynamic'

import { MainLayout } from '../layouts'

const HomePage = dynamic(() => import('../components/pages/Home').then((d) => d.HomePage), {
  ssr: false,
})

const Home: NextPage = () => {
  return (
    <MainLayout title="아티스트들을 위한 디스코드 커뮤니티">
      <HomePage />
    </MainLayout>
  )
}

export default Home
