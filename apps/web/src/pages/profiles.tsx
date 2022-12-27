import {
  BarsArrowDownIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  Square2StackIcon,
  TagIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { InfoProfilesOrderBy } from '@ideaslab/validator/src'
import { PostDetailModalWrapper, PostView } from '~/components/post'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'
import { relativeTimeFormat } from '~/utils/time'

const LIMIT = 50

const ProfilesPage = () => {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [order, setOrder] = useState<InfoProfilesOrderBy>('recentActive')
  const {
    data: profiles,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.info.profiles.useInfiniteQuery(
    { limit: LIMIT, orderBy: order, roles: selectedRoles },
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
              page.map((profile) => (
                <div className="bg-white dark:bg-gray-700/50 dark:border-base-dark rounded galleryUploadCard relative flex flex-col px-4 py-4">
                  <Link href={`/@${profile.handle}`} passHref>
                    <a className="flex flex-col mb-2 no-click" onClick={() => {}}>
                      <div className="flex gap-x-2 items-center">
                        <Image
                          src={profile.avatar}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex flex-col">
                          <div className="text-title-color">{profile.name}</div>
                          <div className="text-description-color text-sm">
                            {`@${profile.handle}`}
                          </div>
                        </div>
                      </div>

                      <div className="text-description-color mt-2 text-sm">{profile.introduce}</div>
                      <div>
                        {profile.roles.map((item) => (
                          <div key={item.id}>{item.name}</div>
                        ))}
                      </div>
                      {profile.links.map((link: any, index: number) => (
                        <div key={index}>{JSON.stringify(link)}</div>
                      ))}
                      <div className="flex justify-around w-full mt-2">
                        <div className="flex-col text-center">
                          <div className="text-md text-title-color">작성글</div>
                          <div className="text-subtitle-color text-sm">{profile._count.posts}</div>
                        </div>
                        <div className="flex-col text-center">
                          <div className="text-md font-bold text-title-color">가입일</div>
                          <div className="text-subtitle-color text-sm">
                            {relativeTimeFormat(profile.createdAt)}
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              )),
            )}
      </InfiniteScroll>
    </MainLayout>
  )
}

export default ProfilesPage
