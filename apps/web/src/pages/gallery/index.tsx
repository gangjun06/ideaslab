import { useState } from 'react'
import { Square2StackIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-css'

import { PostDetailModalWrapper, PostView } from '~/components/post'
import { useRandomArray } from '~/hooks/useRandom'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'

const LIMIT = 50

const breakpointColumns = {
  default: 5,
  1500: 4,
  1300: 3,
  1100: 2,
  700: 2,
  500: 1,
}

const GalleryPage = () => {
  const loadingItemList = useRandomArray(['h-40', 'h-48', 'h-56', 'h-64', 'h-72', 'h-80'], 40)

  const [selectedCategories, setSelectedCategories] = useState<number | null>(null)
  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.gallery.posts.useInfiniteQuery(
    { limit: LIMIT, categoryIds: selectedCategories ? [selectedCategories] : undefined },
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
        <button
          className={classNames('tag hover', selectedCategories === null && 'primary')}
          onClick={() => setSelectedCategories(null)}
          aria-label="전체보기"
          role="checkbox"
          aria-checked={selectedCategories === null}
        >
          <Square2StackIcon width={24} height={24} />
          전체
        </button>
        {categories?.map(({ name, id }) => (
          <button
            role="checkbox"
            className={classNames('tag hover', selectedCategories === id && 'primary')}
            aria-checked={selectedCategories === id}
            key={id}
            onClick={() => setSelectedCategories(id)}
            aria-label={`필터 ${name}`}
          >
            {name}
          </button>
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
                ? loadingItemList.map((size, index) => (
                    <div key={index} className={`${size} bg-pulse rounded w-full`}></div>
                  ))
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
