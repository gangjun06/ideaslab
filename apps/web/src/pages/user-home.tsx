import type { NextPage } from 'next'

import { useUser } from '~/hooks'

import { MainLayout } from '../layouts'

const UserHome: NextPage = () => {
  const user = useUser()

  return (
    <MainLayout title="창작자들을 위한 디스코드 커뮤니티" guard="authOnly">
      <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold">
          <span className="title-highlight">{user?.name}님,</span> <br />
          아이디어스 랩에 오신것을 환영해요.
        </h1>
      </div>
    </MainLayout>
  )
}

export default UserHome
