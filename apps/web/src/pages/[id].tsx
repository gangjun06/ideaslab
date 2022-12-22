import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { PostDetail } from '~/components/post'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'

const MemberDetailPage: NextPage = () => {
  const { query } = useRouter()

  //   const { data } = trpc.gallery.postDetail.useQuery(
  //     { id: typeof query.id === 'string' && !isNaN(query.id as any) ? parseInt(query?.id) : 0 },
  //     {
  //       enabled: typeof query?.id === 'string',
  //       refetchOnReconnect: false,
  //       refetchOnWindowFocus: false,
  //     },
  //   )

  return (
    <MainLayout title={'프로필 상세보기'}>
      <div className="flex flex-col divide-y md:divide-y-0 md:grid grid-flow-col gap-x-12">
        <div className="md:col-span-3 flex flex-col gap-x-1 gap-y-2 tracking-wide pb-4 md:pb-0 card">
          프로필
        </div>
        <div className="pt-4 md:pt-0 md:col-span-9 flex flex-col gap-y-4">내용</div>
      </div>
    </MainLayout>
  )
}

export default MemberDetailPage
