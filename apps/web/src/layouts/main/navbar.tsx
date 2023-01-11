import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/24/outline'

import { buttonClassNames, ButtonLink, Transition, UserMenu } from '~/components/common'
import { useUser } from '~/hooks/useAuth'

const ThemeChanger = dynamic(
  import('./theme').then((d) => d.ThemeChanger),
  { ssr: false },
)

const NavItem = ({
  name,
  href,
  isActive,
  isMobile,
}: {
  name: string
  href: string
  isActive: boolean
  isMobile: boolean
}) => {
  if (isMobile) {
    return (
      <Link passHref href={href}>
        <ButtonLink variant={isActive ? 'light' : 'subtle'} style={{ textAlign: 'left' }}>
          {name}
        </ButtonLink>
      </Link>
    )
  }
  return (
    <Link passHref href={href}>
      <ButtonLink variant={isActive ? 'light' : 'subtle'}>{name}</ButtonLink>
    </Link>
  )
}

export const Navbar = () => {
  const { pathname } = useRouter()
  const profile = useUser()

  const NavItems = ({ isMobile }: { isMobile: boolean }) => (
    <>
      <NavItem name="홈" href="/" isActive={pathname === '/'} isMobile={isMobile} />
      <NavItem
        name="프로필"
        href="/profiles"
        isActive={pathname.startsWith('/profiles')}
        isMobile={isMobile}
      />
      <NavItem
        name="갤러리"
        href="/gallery"
        isActive={pathname.startsWith('/gallery')}
        isMobile={isMobile}
      />
    </>
  )

  return (
    <Disclosure
      as="nav"
      className="shadow bg-white dark:bg-gray-800 z-10 fixed top-0 w-full flex flex-col"
    >
      <div className="flex items-center" style={{ height: 'var(--nav-height)' }}>
        <div className="px-4 container max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" passHref>
            <a className="flex items-center gap-x-3">
              <Image width={32} height={32} alt="" src="/favicon-196.png" />
              <span className="font-bold text-xl">아이디어스랩</span>
            </a>
          </Link>
          <div className={'hidden lg:flex gap-x-4 items-center'} id="main-menu">
            <NavItems isMobile={false} />
          </div>
          <div className="flex gap-x-2 items-center ">
            {profile && typeof profile === 'object' ? (
              <UserMenu />
            ) : (
              <Link href="/login" passHref>
                <ButtonLink variant="subtle">로그인</ButtonLink>
              </Link>
            )}
            <ThemeChanger />
            <Disclosure.Button
              className={buttonClassNames({ forIcon: true, variant: 'default' }, 'block md:hidden')}
            >
              <span className="sr-only">메뉴 열기</span>
              <Bars3Icon width={18} height={18} />
            </Disclosure.Button>
          </div>
        </div>
      </div>
      <Transition type="size">
        <Disclosure.Panel className="flex flex-col px-4 container max-w-4xl mx-auto pb-4">
          <NavItems isMobile={true} />
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  )
}
