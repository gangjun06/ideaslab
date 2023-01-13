import type { GetServerSideProps, NextPage } from 'next'

import { HomePage } from '~/components/pages/Home'

import { MainLayout } from '../layouts'

const Home: NextPage = () => {
  return (
    <MainLayout title="창작자들을 위한 디스코드 커뮤니티" guard="guestOnly">
      <HomePage />
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.cookies['ideas-lab/session']) {
    return {
      redirect: {
        statusCode: 307,
        destination: '/user-home',
      },
    }
  }
  return {
    props: {},
  }
}

export default Home
