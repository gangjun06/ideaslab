import { useEffect } from 'react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import toast from 'react-hot-toast'

import { appRouter } from '~/../../server/src/api/router/_app'
import { trpc } from '~/lib/trpc'

export const tokenAtom = atomWithStorage<null | string>('auth-token', null)

export const tokenDataAtom = atom((get) => {
  const token = get(tokenAtom)
  if (!token) return null

  const splited = token.split('.')
  if (splited.length < 3) return null

  try {
    const parsed = JSON.parse(Buffer.from(splited[1], 'base64').toString('base64'))
    // eslint-disable-next-line @typescript-eslint/ban-types
    return parsed as {}
  } catch (e) {
    return null
  }
})

type UserData = typeof appRouter.auth.profile['_def']['_output_out'] | null
export const userDataAtom = atom<UserData>(null)

export const useLoadUserData = () => {
  // const [token, setToken] = useAtom(tokenAtom)
  const setUserData = useSetAtom(userDataAtom)

  // const enabled = !!token

  const profile = trpc.auth.profile.useQuery(undefined, {
    // enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    onError: (res) => {
      if (res.data?.code !== 'UNAUTHORIZED')
        toast.error('로그인 정보를 받아오던 중 에러가 발생하였어요.')
    },
    onSuccess: (data) => {
      if (!data.isVerified && !sessionStorage.getItem('alert-not-verified')) {
        toast.success('가입되지 않은 유저입니다. 회원가입을 완료해주세요.')
        sessionStorage.setItem('alert-not-verified', 'true')
      }
      setUserData(data)
    },
    retry: (failureCount, error) => {
      if (error.data?.code === 'UNAUTHORIZED') return false
      if (failureCount < 2) return true
      return false
    },
    trpc: { ssr: false },
  })

  // useEffect(() => {
  //   if (profile.data && token === null) {
  //     setUserData(null)
  //   }
  // }, [profile, profile.data, setUserData, token])
  const token = ''

  return { profile, token, isLoading: profile.isLoading }
}

export const useUser = () => useAtomValue(userDataAtom)
