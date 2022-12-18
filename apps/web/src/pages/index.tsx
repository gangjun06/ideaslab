import type { NextPage } from 'next'
import { MainLayout } from '../layouts'
import dynamic from 'next/dynamic'
import { trpc } from '~/lib/trpc'

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
