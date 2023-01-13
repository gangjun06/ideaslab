import { useState } from 'react'
import {
  BarsArrowDownIcon,
  DocumentDuplicateIcon,
  Square2StackIcon,
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'

import { ProfileView } from '~/components/profile'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'

const LIMIT = 50

const ProfilesPage = () => {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [order, setOrder] = useState<string>('recentActive')
  const {
    data: profiles,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.info.profiles.useInfiniteQuery(
    { limit: LIMIT, orderBy: order as any, roles: selectedRoles },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < LIMIT) return undefined
        return lastPage.at(-1)?.discordId ?? undefined
      },
    },
  )
  const { data: roles } = trpc.info.artistRoles.useQuery()

  return (
    <MainLayout
      title="프로필"
      description="아이디어스랩 회원들의 프로필을 확인해요."
      guard="default"
    >
      <div className="flex flex-wrap gap-x-2 justify-center items-center w-full max-w-4xl mx-auto">
        <div
          className={classNames('tag hover', order === 'recentActive' && 'primary')}
          onClick={() => setOrder('recentActive')}
        >
          <DocumentDuplicateIcon width={24} height={24} />
          최근 활동순
        </div>
        <div
          className={classNames('tag hover', order === 'recentJoin' && 'primary')}
          onClick={() => setOrder('recentJoin')}
        >
          <BarsArrowDownIcon width={24} height={24} />
          최근 가입순
        </div>
      </div>
      <div className="flex flex-wrap gap-x-2 justify-center items-center w-full max-w-4xl mx-auto mt-3">
        <div
          className={classNames('tag hover', selectedRoles.length === 0 && 'primary')}
          onClick={() => setSelectedRoles([])}
        >
          <Square2StackIcon width={24} height={24} />
          전체
        </div>
        {roles?.map(({ name, id }) => (
          <div
            className={classNames('tag hover', selectedRoles.includes(id) && 'primary')}
            key={id}
            onClick={() =>
              setSelectedRoles((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : prev.concat(id),
              )
            }
          >
            {name}
          </div>
        ))}
      </div>
      <InfiniteScroll
        className="h-full w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4"
        next={fetchNextPage}
        dataLength={profiles?.pages.reduce((prev, cur) => prev + cur.length, 0) ?? 0}
        hasMore={hasNextPage ?? false}
        loader={
          <div className="w-full text-subtitle-color text-lg font-bold">
            데이터를 불러오고 있어요
          </div>
        }
      >
        {isLoading
          ? new Array(40)
              .fill({})
              .map((_, index) => <div key={index} className={`h-48 bg-pulse rounded w-full`} />)
          : profiles?.pages.map((page) =>
              page.map((profile) => <ProfileView key={profile.discordId} data={profile} />),
            )}
      </InfiniteScroll>
    </MainLayout>
  )
}

export default ProfilesPage
