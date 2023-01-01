import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { PostDetail } from '~/components/post'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'

const GalleryDetailPage: NextPage = () => {
  const { query } = useRouter()

  const { data } = trpc.gallery.postDetail.useQuery(
    { id: typeof query.id === 'string' && !isNaN(query.id as any) ? parseInt(query?.id) : 0 },
    {
      enabled: typeof query?.id === 'string',
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  return (
    <MainLayout title={data?.title ?? ''} tinyContainer showTitle>
      {data && <PostDetail post={data} onClose={() => {}} />}
    </MainLayout>
  )
}

export default GalleryDetailPage
