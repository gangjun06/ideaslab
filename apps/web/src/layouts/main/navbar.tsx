import React, { ReactNode, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Button, ButtonLink, UserMenu } from '~/components/common'
import { useRouter } from 'next/router'
import { useTheme } from '~/hooks/useTheme'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'

const ThemeChanger = dynamic(import('./theme').then((d) => d.ThemeChanger))

const NavItem = ({ name, href, isActive }: { name: string; href: string; isActive: boolean }) => {
  return (
    <Link passHref href={href}>
      <ButtonLink variant={isActive ? 'light' : 'subtle'}>{name}</ButtonLink>
    </Link>
  )
}

export const Navbar = () => {
  const { pathname } = useRouter()
  const session = {} as any

  return (
    <nav className="h-16 shadow sticky bg-white dark:bg-gray-800 flex items-center">
      <div className="px-4 container max-w-4xl mx-auto flex justify-between items-center">
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
          <ThemeChanger />
        </div>
      </div>
    </nav>
  )
}
