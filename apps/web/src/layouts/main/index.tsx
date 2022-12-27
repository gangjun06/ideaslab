import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Button, ButtonLink } from '~/components/common'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { NextSeo } from 'next-seo'
import { parseJWT } from '~/utils'
import Image from 'next/image'
import { useLoadUserData } from '~/hooks/useAuth'
import Link from 'next/link'

type props = {
  children: ReactNode
  title: string
  description?: string
  showTitle?: boolean
  tinyContainer?: boolean
  guard?: 'default' | 'authOnly' | 'adminOnly' | 'guestOnly' | 'unverifyOnly'
  className?: string
}

type JWTToken = {
  name: string
  avatar: string
  isAdmin: boolean
}

export const MainLayout = ({
  children,
  title,
  showTitle = false,
  tinyContainer = false,
  description,
  guard = 'default',
  className = '',
}: props) => {
  const router = useRouter()
  const [authConfirm, setAuthConfirm] = useState<null | (JWTToken & { token: string })>(null)
  const [tokenExpired, setTokenExpired] = useState<boolean>(false)
  const { setToken, token: storageToken, profile } = useLoadUserData()

  useEffect(() => {
    const { token } = router.query
    if (typeof token === 'string' && storageToken === null) {
      const parsed = parseJWT<{ name: string; avatar: string; isAdmin: boolean }>(token)
      if (!parsed) return

      if (Date.now() < parsed.exp) {
        setTokenExpired(true)
      }

      setAuthConfirm({ ...parsed, token })
    }
  }, [router.query, storageToken])

  const displayTitle = useMemo(() => {
    if (title === '') return '아이디어스랩'
    return `${title} | 아이디어스랩`
  }, [title])

  const login = useCallback(async () => {
    if (authConfirm?.token) setToken(authConfirm?.token)
    if (router.pathname === '/login') router.push('/')
    location.reload()
  }, [authConfirm?.token, router, setToken])

  useEffect(() => {
    if (guard === 'guestOnly' && profile.data) router.push('/')
  }, [guard, profile.data, router])

  const content = useMemo(() => {
    if (authConfirm) {
      return (
        <>
          <div className="w-full h-full flex items-center justify-center text-center">
            <div className="flex justify-center items-center flex-col card px-16 py-12">
              <Image
                width={128}
                height={128}
                src={authConfirm.avatar}
                alt="avatar"
                className="rounded-full"
              />
              <div className="font-bold text-xl mt-2">{authConfirm.name}</div>
              <div className="text-sm">
                다음 계정으로 로그인하기 {authConfirm.isAdmin && '(관리자)'}
              </div>
              <Button onClick={login} variant="light" className="mt-4" disabled={tokenExpired}>
                {tokenExpired ? '만료된 로그인 링크에요' : '로그인'}
              </Button>
            </div>
          </div>
        </>
      )
    }

    if (profile.isLoading && guard !== 'default') {
      return <></>
    }

    if (guard === 'authOnly' && !profile.data) {
      return (
        <>
          {showTitle && (
            <h1 className={classNames('text-title-color font-bold text-4xl mt-2 mb-4')}>{title}</h1>
          )}
          <div className="flex justify-center items-center flex-col card px-16 py-12">
            <div className="font-bold text-lg mt-2">
              현재 페이지는 로그인된 사용자만 이용할 수 있어요
            </div>
            <Link href="/login" passHref>
              <ButtonLink variant="light" className="mt-4">
                로그인하기
              </ButtonLink>
            </Link>
          </div>
        </>
      )
    }

    if (guard === 'adminOnly' && !profile.data?.isAdmin) {
      return (
        <>
          {showTitle && (
            <h1 className={classNames('text-title-color font-bold text-4xl mt-2 mb-4')}>{title}</h1>
          )}
          <div className="flex justify-center items-center flex-col card px-16 py-12">
            <div className="font-bold text-lg mt-2">관리자만 이용할 수 있는 페이지에요.</div>
          </div>
        </>
      )
    }

    if (guard === 'authOnly' && !profile.data?.isVerified) {
      return (
        <>
          {showTitle && (
            <h1 className={classNames('text-title-color font-bold text-4xl mt-2 mb-4')}>{title}</h1>
          )}
          <div className="flex justify-center items-center flex-col card px-16 py-12">
            <div className="font-bold text-lg mt-2">
              아이디어스랩을 이용하시려면 회원가입을 먼저 완료해주세요
            </div>
            <Link href="/signup" passHref>
              <ButtonLink variant="light" className="mt-4">
                회원가입하기
              </ButtonLink>
            </Link>
          </div>
        </>
      )
    }

    return (
      <>
        {showTitle && (
          <h1 className={classNames('text-title-color font-bold text-4xl mt-2 mb-4')}>{title}</h1>
        )}
        {children}
      </>
    )
  }, [
    authConfirm,
    children,
    guard,
    login,
    profile.data,
    profile.isLoading,
    showTitle,
    title,
    tokenExpired,
  ])

  return (
    <>
      <NextSeo title={displayTitle} description={description} />
      <Toaster />
      <Navbar />
      <div
        className={classNames(
          'container mx-auto pt-4 py-4 px-4',
          tinyContainer && 'max-w-4xl',
          className,
        )}
        style={{
          minHeight: 'calc(100% - 64px)',
        }}
      >
        {content}
      </div>

      <Footer />
    </>
  )
}
