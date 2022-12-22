import { Square2StackIcon, TagIcon, ViewColumnsIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import Image from 'next/image'
import { Fragment, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-css'
import { appRouter } from '~/../../server/src/router/_app'
import { PostDetailModalWrapper, PostView } from '~/components/post'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'
import { Unarray } from '~/types/utils'
import { relativeTimeFormat } from '~/utils/time'

const LIMIT = 50

const breakpointColumns = {
  default: 6,
  1500: 5,
  1300: 4,
  1100: 3,
  700: 2,
  500: 1,
}

const GalleryPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.gallery.posts.useInfiniteQuery(
    { limit: LIMIT, categoryIds: selectedCategories },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < LIMIT) return undefined
        return lastPage.at(-1)?.id ?? undefined
      },
    },
  )
  const { data: categories } = trpc.gallery.categories.useQuery()

  return (
    <MainLayout title="갤러리" description="서로의 작품을 올리고 공유해요" guard="default">
      <div className="flex flex-wrap gap-x-2 justify-center items-center w-full max-w-4xl mx-auto">
        <div
          className={classNames('tag hover', selectedCategories.length === 0 && 'primary')}
          onClick={() => setSelectedCategories([])}
        >
          <Square2StackIcon width={24} height={24} />
          전체
        </div>
        {categories?.map(({ name, id }) => (
          <div
            className={classNames('tag hover', selectedCategories.includes(id) && 'primary')}
            key={id}
            onClick={() =>
              setSelectedCategories((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : prev.concat(id),
              )
            }
          >
            {name}
          </div>
        ))}
      </div>
      <PostDetailModalWrapper>
        {({ showDetail }) => (
          <InfiniteScroll
            className="h-full w-11/12 mx-auto"
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
                'my-masonry-grid mt-4 flex gap-4',
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
                    return <div key={index} className={`${sizes} bg-gray-800 rounded w-full`}></div>
                  })
                : posts?.pages.map((page) =>
                    page.map((post) => (
                      <PostView key={post.id} post={post} onClick={() => showDetail(post.id)} />
                    )),
                  )}
            </Masonry>
          </InfiniteScroll>
        )}
      </PostDetailModalWrapper>
    </MainLayout>
  )
}

export default GalleryPage
