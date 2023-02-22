import { ReactNode } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import { PostDetailModalWrapper, PostView2 } from '~/components/post'
import { ProfileView } from '~/components/profile'
import { useUser } from '~/hooks'
import { trpc } from '~/utils'

import { MainLayout } from '../layouts'

const LIMIT = 10

const breakpoints = {
  '640': {
    slidesPerView: 2,
  },
  '1024': {
    slidesPerView: 3,
  },
}

const Block = ({
  title,
  description,
  href,
  children,
  mt,
}: {
  title: string
  description: string
  href: string
  children: ReactNode
  mt?: boolean
}) => {
  return (
    <div className={mt ? 'mt-8' : ''}>
      <Link href={href} passHref>
        <a className="text-subtitle-color text-xl flex items-center">
          {title}
          <ChevronRightIcon width={24} height={24} />
        </a>
      </Link>
      <div className="text-description-color mb-2 text-sm">{description}</div>
      <Swiper
        slidesPerView={1}
        spaceBetween={15}
        pagination={{
          clickable: true,
        }}
        breakpoints={breakpoints}
        modules={[Navigation]}
        navigation
        className="mySwiper"
      >
        {children}
      </Swiper>
    </div>
  )
}

const UserHome: NextPage = () => {
  const user = useUser()

  const { data: posts, isLoading: isLoadingPosts } = trpc.gallery.posts.useQuery({ limit: LIMIT })
  const { data: profiles, isLoading: isLoadingProfiles } = trpc.info.profiles.useQuery({
    limit: LIMIT,
  })

  return (
    <MainLayout title="창작자들을 위한 디스코드 커뮤니티" guard="authOnly">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">
          <span className="title-highlight">{user?.name}님,</span> <br />
          아이디어스 랩에 오신것을 환영해요.
        </h1>

        <PostDetailModalWrapper>
          {({ showDetail }) => (
            <Block
              title="최근 업로드된 게시글"
              description="갤러리에 어떤 작품들이 올라왔는지 구경해보아요."
              href="/gallery"
            >
              {isLoadingPosts && (
                <SwiperSlide>
                  <div className="bg-pulse rounded w-full h-80"></div>
                  <div className="bg-pulse rounded w-full h-80"></div>
                  <div className="bg-pulse rounded w-full h-80"></div>
                </SwiperSlide>
              )}
              {posts?.map((item) => (
                <SwiperSlide key={item.id}>
                  <PostView2 post={item} onClick={() => showDetail(item.id)} />
                </SwiperSlide>
              ))}
            </Block>
          )}
        </PostDetailModalWrapper>
        <Block
          mt
          title="최근 가입한 유저들"
          description="어떤 새로운 분들이 아이디어스 랩에 오셨는지 살펴보아요"
          href="/profiles"
        >
          {isLoadingProfiles && (
            <SwiperSlide>
              <div className="bg-pulse rounded w-full h-44"></div>
              <div className="bg-pulse rounded w-full h-44"></div>
              <div className="bg-pulse rounded w-full h-44"></div>
            </SwiperSlide>
          )}
          {profiles?.map((profile) => (
            <SwiperSlide key={profile.discordId}>
              <ProfileView key={profile.discordId} data={profile} />
            </SwiperSlide>
          ))}
        </Block>
      </div>
    </MainLayout>
  )
}

export default UserHome
