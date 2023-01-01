import Image from 'next/image'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="px-4 py-8 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
      <div className="container flex flex-wrap items-center justify-center mx-auto space-y-4 sm:justify-between sm:space-y-0">
        <div className="flex flex-row pr-3 space-x-4 sm:space-x-8">
          <Image src="/favicon-196.png" width={48} height={48} alt="ideaslab logo" />
          <ul className="flex flex-wrap items-center space-x-4 sm:space-x-8">
            <li>
              <Link href="/privacy">이용약관</Link>
            </li>
            <li>
              <Link href="/info">웹사이트 정보</Link>
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
  )
}
