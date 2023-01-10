import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import ForbiddenImage from '~/assets/forbidden.svg'
import { ButtonLink } from '~/components/common'
import { PostDetail, PostLoading } from '~/components/post'
import { MainLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'

const GalleryDetailPage: NextPage = () => {
  const { query } = useRouter()

  const { data, isLoading, error } = trpc.gallery.postDetail.useQuery(
    { id: typeof query.id === 'string' && !isNaN(query.id as any) ? parseInt(query?.id) : 0 },
    {
      enabled: typeof query?.id === 'string',
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: () => {},
      retry: (failureCount, error) => {
        if (error.data?.code === 'FORBIDDEN') return false
        if (failureCount < 2) return true
        return false
      },
    },
  )

  return (
    <MainLayout title={data?.title ?? ''} tinyContainer showTitle>
      {isLoading && <PostLoading />}
      {data && <PostDetail post={data} onClose={() => {}} />}
      {error?.data?.code === 'FORBIDDEN' && (
        <div className="text-center flex items-center justify-center flex-col h-full mt-4">
          <div className="w-48">
            <Image alt="" src={ForbiddenImage} />
          </div>
          <div className="font-bold text-title-color text-lg mt-4">
            아이디어스랩 회원만 볼 수 있는 게시글이에요
          </div>
          <div className="text-description-color">
            아이디어스 랩 디스코드 서버에 가입하여 다양한 컨텐츠들을 즐기세요!
          </div>
          <div className="flex mt-2">
            <Link href="/" passHref>
              <ButtonLink variant="light">확인하러 가기</ButtonLink>
            </Link>
          </div>
          <div className="text-xl font-bold mt-8">이미 회원이신가요?</div>
          <div className="flex mt-2">
            <Link href="/login" passHref>
              <ButtonLink variant="light">로그인하기</ButtonLink>
            </Link>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default GalleryDetailPage
