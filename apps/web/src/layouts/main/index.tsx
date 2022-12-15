import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { Button, ButtonLink, UserMenu } from '~/components/common'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import { useTheme } from '~/hooks/useTheme'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { Navbar } from './navbar'
import { Footer } from './footer'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import { parseJWT } from '~/utils'
import Image from 'next/image'
import { useLoadUserData } from '~/hooks/useAuth'

type props = {
  children: ReactNode
  title: string
  description?: string
  showTitle?: boolean
  tinyContainer?: boolean
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
}: props) => {
  const router = useRouter()
  const [authConfirm, setAuthConfirm] = useState<null | (JWTToken & { token: string })>(null)
  const [tokenExpired, setTokenExpired] = useState<boolean>(false)
  const { setToken } = useLoadUserData()

  useEffect(() => {
    const { token } = router.query
    if (typeof token === 'string' && token === null) {
      const parsed = parseJWT<{ name: string; avatar: string; isAdmin: boolean }>(token)
      if (!parsed) return

      if (Date.now() < parsed.exp) {
        setTokenExpired(true)
      }

      setAuthConfirm({ ...parsed, token })
    }
  }, [router.query])

  const displayTitle = useMemo(() => {
    if (title === '') return '아이디어스랩'
    return `${title} | 아이디어스랩`
  }, [title])

  const login = useCallback(async () => {
    if (authConfirm?.token) setToken(authConfirm?.token)
    if (router.pathname === '/login') router.push('/')
    else location.reload()
  }, [authConfirm?.token, setToken])

  const content = useMemo(() => {
    if (!authConfirm) {
      return (
        <>
          {showTitle && (
            <h1 className={classNames('text-title-color font-bold text-4xl mt-2 mb-4')}>{title}</h1>
          )}
          {children}
        </>
      )
    }

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
  }, [authConfirm, children, login, showTitle, title, tokenExpired])

  return (
    <>
      <NextSeo title={displayTitle} description={description} />
      <Toaster />
      <Navbar />
      <div
        className={classNames(
          'container mx-auto pt-4 py-4 h-full px-4',
          tinyContainer && 'max-w-4xl',
        )}
        style={{
          height: 'calc(100% - 64px)',
        }}
      >
        {content}
      </div>

      <Footer />
    </>
  )
}
