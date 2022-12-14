import React, { ReactNode, useCallback, useMemo } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { signIn, useSession } from 'next-auth/react'
import { Button, ButtonLink, UserMenu } from '~/components/common'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import { useTheme } from '~/hooks/useTheme'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

type props = {
  children: ReactNode
}

const NavItem = ({ name, href, isActive }: { name: string; href: string; isActive: boolean }) => {
  return (
    <Link passHref href={href}>
      <ButtonLink variant={isActive ? 'light' : 'subtle'}>{name}</ButtonLink>
    </Link>
  )
}

export const MainLayout = ({ children }: props) => {
  // const session = useSession();
  const { pathname } = useRouter()
  const session = {} as any
  const [theme, setTheme] = useTheme()

  const currentTheme = useMemo(() => {
    if (theme === 'system') {
      if (typeof globalThis.matchMedia !== 'function') return 'light'
      if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
      return 'light'
    }
    return theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    if (theme !== 'system') {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      return
    }

    if (typeof globalThis.matchMedia !== 'function') return 'light'
    if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('light')
      return
    }

    setTheme('dark')
  }, [setTheme, theme])

  return (
    <>
      <Toaster />
      <nav className="px-4 py-3 shadow sticky bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/" passHref>
            <a className="font-bold">아이디어스랩</a>
          </Link>
          <div className="flex gap-x-4 items-center">
            <NavItem name="홈" href="/" isActive={pathname === '/'} />
            <NavItem name="프로필" href="/profile" isActive={pathname.startsWith('/profile')} />
            <NavItem name="갤러리" href="/gallery" isActive={pathname.startsWith('/gallery')} />
          </div>
          <div className="flex gap-x-2 items-center">
            {session.data ? (
              <UserMenu />
            ) : (
              <Link href="/login" passHref>
                <ButtonLink variant="subtle">로그인</ButtonLink>
              </Link>
            )}
            <Button forIcon onClick={toggleTheme}>
              {currentTheme === 'dark' ? (
                <SunIcon width={18} height={18} />
              ) : (
                <MoonIcon width={18} height={18} />
              )}
            </Button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto py-4 h-full px-2">{children}</div>
      <footer className="px-4 py-8 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <div className="container flex flex-wrap items-center justify-center mx-auto space-y-4 sm:justify-between sm:space-y-0">
          <div className="flex flex-row pr-3 space-x-4 sm:space-x-8">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-green-600 dark:bg-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                className="w-5 h-5 rounded-full text-gray-50"
              >
                <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
              </svg>
            </div>
            <ul className="flex flex-wrap items-center space-x-4 sm:space-x-8">
              <li>
                <a rel="noopener noreferrer" href="#">
                  이용약관
                </a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">
                  개인정보 처리방침
                </a>
              </li>
            </ul>
          </div>
          <ul className="flex flex-wrap pl-3 space-x-4 sm:space-x-8">
            <li>
              <a rel="noopener noreferrer" href="#">
                디스코드
              </a>
            </li>
            <li>
              <a rel="noopener noreferrer" href="#">
                깃허브
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
