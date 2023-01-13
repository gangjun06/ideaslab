import type { NextPage } from 'next'

import { HomePage } from '~/components/pages/Home'

import { MainLayout } from '../layouts'

// const HomePage = dynamic(() => import('../components/pages/Home').then((d) => d.HomePage), {
//   ssr: false,
// })

const Home: NextPage = () => {
  return (
    <MainLayout title="창작자들을 위한 디스코드 커뮤니티" guard="guestOnly">
      <HomePage />
    </MainLayout>
  )
}

export default Home
