import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { trpc } from '~/lib/trpc'
import { MainLayout } from '../layouts'
import { TabSelect } from '~/components/common/tab-select'
import { useCallback, useState } from 'react'
import { PinInput } from '~/components/common/pin-input'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import { tokenAtom } from '~/hooks/useAuth'
import { useAtom } from 'jotai'

const LoginPage: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [token, setToken] = useAtom(tokenAtom)

  const loginWithPinMutation = trpc.auth.loginWithPin.useMutation({
    onMutate: () => {
      toast.loading('요청 중...', { id: 'mutation' })
    },
    onError: () => {
      toast.error('요청 중 에러가 발생하였어요', { id: 'mutation' })
    },
    onSuccess: ({ token }) => {
      if (!token) {
        toast.error('잘못된 핀 번호에요', { id: 'mutation' })
        return
      }
      toast.success('성공적으로 로그인 되었어요.', { id: 'mutation' })
      setToken(token)
      location.href = '/'
    },
  })

  const onEnterAll = useCallback(
    (pin: string) => {
      loginWithPinMutation.mutate({ pin })
    },
    [loginWithPinMutation],
  )

  return (
    <MainLayout title="로그인" showTitle tinyContainer guard="guestOnly">
      <TabSelect
        list={[
          { label: '아이디어스랩 맴버', value: 0 },
          { label: '맴버가 아니에요', value: 1 },
        ]}
        selected={selectedTab}
        onChange={(value) => setSelectedTab(value)}
      />
      <div className="text-center mt-8">
        {selectedTab === 0 ? (
          <div>
            <div className="text-lg font-bold mb-8 flex items-center justify-center flex-wrap">
              <div>
                <span className="title-highlight">아이디어스랩</span> 디스코드에서 채팅창에
              </div>
              <span className="px-1.5 py-1 bg-gray-100 dark:bg-gray-800 border-base-color border-2 rounded-lg mx-1">
                /로그인
              </span>
              을 입력하세요
            </div>

            <div className="card px-4 py-8">
              <div className="text-lg">PIN 코드로 로그인하기</div>
              <PinInput name="pin-login" onEnterAll={onEnterAll} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="font-semibold text-2xl tracking-wide">
              아이디어스랩에 가입하여 다양한 정보를 나누세요!
            </div>
            <a
              rel="noopener noreferrer"
              href={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL}
              className="px-8 py-3 text-lg font-semibold rounded bg-primary-600 text-gray-50 dark:bg-primary-400 dark:text-gray-900"
            >
              가입하기
            </a>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default LoginPage
