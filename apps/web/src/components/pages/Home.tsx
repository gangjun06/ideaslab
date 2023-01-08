import Image from 'next/image'
import { CheckIcon } from '@heroicons/react/24/outline'
import Typed from 'react-typed'

import MainImage from '~/assets/main-image.svg'
import { trpc } from '~/lib/trpc'

const HeaderSection = () => (
  <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between gap-x-8 mt-12">
    <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:text-left w-full flex-1">
      <h1 className="text-5xl font-bold leading-none sm:text-6xl">
        <Typed
          strings={[
            '당신의 <span class="title-highlight">아이디어에</span> 축복을',
            '<span class="title-highlight">아이디어스</span>랩',
          ]}
          smartBackspace
          typeSpeed={40}
          backSpeed={50}
        />
      </h1>
      <div className="mt-6 mb-8 text-lg sm:mb-12 text-subtitle-color">
        <p className="inline title-highlight">아이디어스랩</p>
        은 창작자들의 아이디어에 날개를 달아주는 디스코드 서버입니다.
        <br />
        여러 분야의 창작자와 작업, 아이디어 논의, 프로젝트 진행 등을 할 수 있어요
        <br />
      </div>
      <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
        <a
          rel="noopener noreferrer"
          href="#"
          className="px-8 py-3 text-lg font-semibold rounded bg-primary-600 text-gray-50 dark:bg-primary-400 dark:text-gray-900"
        >
          가입하기
        </a>
        <a
          rel="noopener noreferrer"
          href="#"
          className="px-8 py-3 text-lg font-semibold border rounded border-gray-800 dark:border-gray-100"
        >
          둘러보기
        </a>
      </div>
    </div>
    <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 flex-1">
      <Image src={MainImage} alt="" className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112" />
    </div>
  </div>
)

const StatSection = () => {
  const { data: stat } = trpc.info.stat.useQuery(undefined, { trpc: { ssr: true } })

  return (
    <section className="p-6 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto grid justify-center grid-cols-2 text-center lg:grid-cols-3">
        <div className="flex flex-col justify-start m-2 lg:m-6">
          <p className="text-4xl font-bold leading-none lg:text-6xl">
            {stat ? `${stat.memberCount}` : '불러오는중'}
          </p>
          <p className="text-sm sm:text-base">창작자들</p>
        </div>
        <div className="flex flex-col justify-start m-2 lg:m-6">
          <p className="text-4xl font-bold leading-none lg:text-6xl">N</p>
          <p className="text-sm sm:text-base">현재 음성채팅방 사용자</p>
        </div>
        <div className="flex flex-col justify-start m-2 lg:m-6">
          <p className="text-4xl font-bold leading-none lg:text-6xl">M</p>
          <p className="text-sm sm:text-base">등록된 게시글</p>
        </div>
      </div>
    </section>
  )
}

const DescriptionSection = () => {
  const InnerContent = ({ name, description }: { name: string; description: string }) => (
    <div className="flex">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-emerald-600 text-gray-50 dark:bg-emerald-400 dark:text-gray-900">
          <CheckIcon width={24} height={24} />
        </div>
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-medium leading-6 dark:text-gray-50 text-gray-900">{name}</h4>
        <p className="mt-1.5 text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  )
  return (
    <section className="container max-w-xl p-6 py-12 mx-auto space-y-24 lg:px-8 lg:max-w-7xl">
      <div className="grid lg:gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl dark:text-gray-50">
            아이디어스 랩 컨텐츠
          </h3>
          <p className="mt-3 text-lg dark:text-gray-400">
            아이디어스랩 디스코드 서버에는 많은 컨텐츠가 준비되어 있습니다.
          </p>
          <div className="mt-12 space-y-12">
            <InnerContent
              name="다양한 분야의 갤러리"
              description="각 창작분야별로 자신의 작업물을 업로드하여 공유할 수 있습니다."
            />
            <InnerContent
              name="자율적인 통화방"
              description="통화방은 직접 생성할 수 있으며, 용도에 따라 다양하게 사용될 수 있습니다."
            />
            <InnerContent
              name="즐거움은 커뮤니티다"
              description="일상이야기, 작업관련 이야기, 작품추천, 정보를 포럼형태로 이야기 할 수 있습니다."
            />
            <InnerContent
              name="다양한 분야의 갤러리"
              description="일상이야기, 작업관련 이야기, 작품추천, 정보를 포럼형태로 이야기 할 수 있습니다."
            />
            <InnerContent
              name="사소한 것부터 큰 것 까지! 같이하실분"
              description="같이 할 친구부터 해서 동료까지 구하는 곳입니다. 예를들어 게임부터해서 스터디,
                    함께할 프로젝트 인원을 구할 수 있습니다."
            />
          </div>
        </div>
        <div aria-hidden="true" className="mt-10 lg:mt-0">
          <img
            src="https://media.discordapp.net/attachments/1022121230289096744/1053273035081269258/jo-szczepanska-9OKGEVJiTKk-unsplash.jpg?width=500&height=800"
            alt=""
            className="mx-auto rounded-lg shadow-lg dark:bg-gray-500"
          />
        </div>
      </div>
    </section>
  )
}

const WhyJoinSection = () => {
  const InnerContent = ({ description }: { description: string }) => (
    <div className="flex">
      <CheckIcon width={24} height={24} className="text-emerald-700 dark:text-emerald-400" />
      <div className="ml-3">
        <dd className="text-gray-600 dark:text-gray-400">{description}</dd>
      </div>
    </div>
  )
  return (
    <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          여러분이 아이디어스 랩에서 활동해야 하는 이유!
        </h2>
      </div>
      <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
        <InnerContent description="다양한 분야의 창작하는 사람들과 만나면서 여러 방면으로 피드백을 받을 수 있기 때문입니다." />
        <InnerContent description="창작을 하다가 아이디어가 막히면 논의하기 좋은 공간이기 때문입니다." />
        <InnerContent description="혼자 작업하다가 외로우면 같이 떠들면서 작업하기 좋은 곳입니다." />
        <InnerContent description="혼자서 만들기 어러운 프로젝트를 다양한 사람들과 협업할 수 있는 곳입니다." />
      </dl>
    </section>
  )
}

const InviteSection = () => (
  <section className="py-6">
    <div className="container mx-auto flex flex-col lg:flex-row	items-center justify-center lg:justify-between p-4 space-y-8 lg:space-y-0 md:p-10 md:px-24 xl:px-48">
      <h1 className="text-5xl font-bold leading-none text-center">
        자, 이제 함께 할 준비가 되었나요?
      </h1>
      <div className="flex flex-col">
        <button className="px-8 py-3 text-lg font-semibold rounded bg-primary-600 text-gray-50 dark:bg-primary-400 dark:text-gray-900">
          가입하기
        </button>
      </div>
    </div>
  </section>
)

export const HomePage = () => {
  return (
    <>
      <HeaderSection />
      <StatSection />
      <div className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
        <DescriptionSection />
        <WhyJoinSection />
      </div>
      <InviteSection />
    </>
  )
}
