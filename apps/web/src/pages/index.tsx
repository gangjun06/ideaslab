import type { NextPage } from 'next'
import Image from 'next/image'
import { MainLayout } from '../layouts'
import MainImage from '~/assets/main-image.svg'
import Typed from 'react-typed'

const Home: NextPage = () => {
  return (
    <MainLayout title="">
      <div className="flex flex-col h-full w-full justify-center -mt-24">
        <section>
          <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between gap-x-8">
            <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left w-full">
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
              <p className="mt-6 mb-8 text-lg sm:mb-12">
                다양한 사람들과 아이디어를 공유하며 즐거운 창작활동을 하세요
              </p>
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
            <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
              <Image
                src={MainImage}
                width={983}
                height={543}
                alt=""
                className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
              />
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default Home
