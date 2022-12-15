import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { appRouter } from '~/../../server/src/router/_app'
import { trpc } from '~/lib/trpc'

export const tokenAtom = atomWithStorage<null | string>('auth-token', null)

export const tokenDataAtom = atom((get) => {
  const token = get(tokenAtom)
  if (!token) return null

  var splited = token.split('.')
  if (splited.length < 3) return null

  try {
    const parsed = JSON.parse(Buffer.from(splited[1], 'base64').toString('base64'))
    return parsed as {}
  } catch (e) {
    return null
  }
})

type userData = typeof appRouter.auth.profile['_def']['_output_out'] | null | 'error'
export const userDataAtom = atom<userData>(null)

export const useLoadUserData = () => {
  const [token, setToken] = useAtom(tokenAtom)
  const setUserData = useSetAtom(userDataAtom)

  const profile = trpc.auth.profile.useQuery(undefined, {
    enabled: !!token,
    onError: () => {
      toast.error('로그인 정보를 받아오던 중 에러가 발생하였어요.')
    },
    onSuccess: (data) => {
      if (!data.isVerified && !sessionStorage.getItem('alert-not-verified')) {
        toast.success('가입되지 않은 유저입니다. 회원가입을 완료해주세요.')
        sessionStorage.setItem('alert-not-verified', 'true')
      }
      setUserData(data)
    },
  })

  useEffect(() => {
    if (profile.data && token === null) {
      setUserData(null)
    }
  }, [profile.data, setUserData, token])

  return { profile, token, setToken }
}

export const useUser = () => {
  const userData = useAtomValue(userDataAtom)
  return userData
}
