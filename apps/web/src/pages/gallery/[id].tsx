import { useMemo } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { MemberOnlyContent } from '~/components/login'
import { PostDetail, PostLoading } from '~/components/post'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'

const GalleryDetailPage: NextPage = () => {
  const { query } = useRouter()

  const id = useMemo(() => {
    if (typeof query.id !== 'string' || isNaN(query.id as any)) return -1
    return parseInt(query.id)
  }, [query])

  const { data, isLoading, error } = trpc.gallery.postDetail.useQuery(
    { id },
    {
      enabled: id > 0,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.data?.code === 'FORBIDDEN') return false
        if (failureCount < 2) return true
        return false
      },
    },
  )

  return (
    <MainLayout
      title={data?.title ?? ''}
      tinyContainer
      showTitle
      pageBack={{ label: '갤러리', to: '/gallery' }}
    >
      {isLoading && <PostLoading />}
      {data && <PostDetail post={data} />}
      {error?.data?.code === 'FORBIDDEN' && <MemberOnlyContent name="게시글" />}
    </MainLayout>
  )
}

export default GalleryDetailPage
