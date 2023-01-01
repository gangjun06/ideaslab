import { useEffect } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-css'

import { PostDetailModalWrapper, PostView } from '~/components/post'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'
import { dateShortFormat } from '~/utils/time'

const LIMIT = 50

const breakpointColumns = {
  default: 3,
  1500: 3,
  1300: 2,
  500: 1,
}

const MemberDetailPage: NextPage = () => {
  const { query } = useRouter()
  const router = useRouter()

  const { data } = trpc.gallery.profile.useQuery(
    { id: typeof query.id === 'string' ? query.id.substring(1) : '' },
    {
      enabled: typeof query?.id === 'string',
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.gallery.posts.useInfiniteQuery(
    { limit: LIMIT, authorHandle: typeof query.id === 'string' ? query.id.substring(1) : '' },
    {
      enabled: typeof query?.id === 'string',
      getNextPageParam: (lastPage) => {
        if (lastPage.length < LIMIT) return undefined
        return lastPage.at(-1)?.id ?? undefined
      },
    },
  )

  useEffect(() => {
    if (typeof query.id !== 'string') {
      return
    }
    if (query.id.length > 0 && !query.id.startsWith('@')) {
      router.push('/')
    }
  }, [])

  return (
    <MainLayout title={'프로필 상세보기'} className="mt-6">
      {data && (
        <div className="flex flex-col gap-y-12 lg:flex-row gap-x-12">
          <div className="relative w-full lg:max-w-xs flex justify-center lg:block">
            <div className="flex flex-col lg:card items-center justify-center px-4 py-6 w-full">
              <Image src={data.avatar} width={128} height={128} className="rounded-full" />
              <div className="text-title-color text-lg font-bold tracking-wide mt-2">
                {data.name}
              </div>
              <div className="text-subtitle-color">{`@${data.handle}`}</div>
              <div className="flex gap-x-2 mt-2">
                {data.roles?.map((item, index) => (
                  <div key={index} className="tag">
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="text-description-color mt-2 text-sm">{data.introduce}</div>

              {data.links.length > 0 && (
                <div className="mt-2">
                  {data.links.map((link: any, index) => (
                    <a key={index} href={link?.url ?? ''} className="title-highlight">
                      {link?.name}
                    </a>
                  ))}
                </div>
              )}
              <div className="flex justify-around w-full mt-4">
                <div className="flex-col text-center">
                  <div className="text-lg font-bold text-title-color">작성글</div>
                  <div className="text-md text-subtitle-color">{data._count.posts}</div>
                </div>
                <div className="flex-col text-center">
                  <div className="text-xl font-bold text-title-color">가입일</div>
                  <div className="text-md text-subtitle-color">
                    {dateShortFormat(data.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <PostDetailModalWrapper baseUrl={`/@${router.query.id?.slice(1)}`}>
              {({ showDetail }) => (
                <InfiniteScroll
                  className="h-full w-full"
                  next={fetchNextPage}
                  dataLength={posts?.pages.reduce((prev, cur) => prev + cur.length, 0) ?? 0}
                  hasMore={hasNextPage ?? false}
                  loader={
                    <div className="w-full text-subtitle-color text-lg font-bold">
                      데이터를 불러오고 있어요
                    </div>
                  }
                >
                  <Masonry
                    className={classNames(
                      'my-masonry-grid flex gap-4',
                      isLoading && 'animate-pulse',
                    )}
                    columnClassName="my-masonry-grid_column flex flex-col gap-y-3"
                    breakpointCols={breakpointColumns}
                  >
                    {isLoading
                      ? new Array(40).fill({}).map((_, index) => {
                          const sizes = ['h-40', 'h-48', 'h-56', 'h-64', 'h-72', 'h-80'][
                            Math.floor(Math.random() * 6)
                          ]
                          return (
                            <div key={index} className={`${sizes} bg-pulse rounded w-full`}></div>
                          )
                        })
                      : posts?.pages.map((page) =>
                          page.map((post) => (
                            <PostView
                              key={post.id}
                              post={post}
                              onClick={() => showDetail(post.id)}
                            />
                          )),
                        )}
                  </Masonry>
                </InfiniteScroll>
              )}
            </PostDetailModalWrapper>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default MemberDetailPage
