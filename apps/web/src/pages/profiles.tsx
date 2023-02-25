import { DocumentDuplicateIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import InfiniteScroll from 'react-infinite-scroll-component'

import { TagFilter } from '~/components/common/tag-filter'
import { ProfileView } from '~/components/profile'
import { useQueryState } from '~/hooks/useQueryState'
import { MainLayout } from '~/layouts'
import { trpc } from '~/utils'

const LIMIT = 50

const ProfilesPage = () => {
  const [order, setOrder] = useQueryState({
    name: 'order',
    defaultValue: 'recentActive',
    type: 'string',
  })

  const [selectedRole, setSelectedRole] = useQueryState({
    name: 'role',
    defaultValue: null,
    type: 'number',
    nullable: true,
  })

  const {
    data: profiles,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.info.profiles.useInfiniteQuery(
    { limit: LIMIT, orderBy: order as any, roles: selectedRole ? [selectedRole] : [] },
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
      <TagFilter
        data={[
          {
            label: (
              <>
                <DocumentDuplicateIcon width={24} height={24} />
                최근 활동순
              </>
            ),
            value: 'recentActive',
          },
          {
            label: (
              <>
                <Square2StackIcon width={24} height={24} />
                최근 활동순
              </>
            ),
            value: 'recentJoin',
          },
        ]}
        onSelect={(value) => setOrder(value)}
        selected={order}
        useShowAll={false}
      />
      <TagFilter
        className="mt-4"
        data={roles?.map(({ name, id }) => ({ label: name, value: id }))}
        onSelect={(value) => setSelectedRole(value)}
        selected={selectedRole}
      />
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
