import React, { ReactNode, useCallback, useMemo } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { signIn, useSession } from 'next-auth/react'
import { Button, ButtonLink, UserMenu } from '~/components/common'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import { useTheme } from '~/hooks/useTheme'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { Navbar } from './navbar'
import { Footer } from './footer'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

type props = {
  children: ReactNode
  title: string
  description?: string
  showTitle?: boolean
  tinyContainer?: boolean
}

export const MainLayout = ({
  children,
  title,
  showTitle = false,
  tinyContainer = false,
  description,
}: props) => {
  // const session = useSession();
  const session = {} as any

  const displayTitle = useMemo(() => {
    if (title === '') return '아이디어스랩'
    return `${title} | 아이디어스랩`
  }, [title])

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
        {showTitle && (
          <h1 className={classNames('text-title-color font-bold text-4xl mt-2 mb-4')}>{title}</h1>
        )}
        {children}
      </div>
      <Footer />
    </>
  )
}
