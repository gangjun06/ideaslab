import { Menu } from '@headlessui/react'
import classNames from 'classnames'
import { Transition } from './transition'
import Image from 'next/image'
import Link from 'next/link'

export const UserMenu = () => {
  const { data } = {} as any

  if (!data) return <></>
  const { image, name } = data.user

  return (
    <Menu as="div" className="relative ml-3 w-fit">
      <Menu.Button className="flex items-center rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-black/5">
        <span className="sr-only">유저메뉴 열기</span>
        <Image className="rounded-full" src={image || ''} alt="avatar" width={32} height={32} />
        <div className="ml-2 mb-1 font-bold leading-tight">{name}</div>
      </Menu.Button>
      <Transition type="size">
        <Menu.Items
          className={classNames(
            'absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-xl shadow-xl backdrop-blur-md focus:outline-none',
            'border-[0.5px] border-gray-300 bg-gray-100 opacity-80',
          )}
        >
          <Link href="/settings/profile">
            <Menu.Item
              as="a"
              className="block w-full rounded-lg px-3.5 py-2 text-left font-light transition-colors duration-300 hover:bg-black hover:bg-opacity-5"
            >
              설정
            </Menu.Item>
          </Link>
          <Menu.Item>
            <button
              className={
                'block w-full rounded-lg px-3.5 py-2 text-left font-light transition-colors duration-300 hover:bg-black hover:bg-opacity-5'
              }
            >
              로그아웃
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
