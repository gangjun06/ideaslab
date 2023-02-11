import Image from 'next/image'
import Link from 'next/link'

import type { AppRouter } from '@ideaslab/server/app'

import { Unarray } from '~/types/utils'
import { relativeTimeFormat } from '~/utils'

export const ProfileView = ({
  data,
}: {
  data: Unarray<AppRouter['info']['profiles']['_def']['_output_out']>
}) => {
  return (
    <div className="bg-white dark:bg-gray-700/50 border-base-color rounded-lg relative flex flex-col px-4 py-4 border drop-shadow-sm">
      <Link href={`/@${data.handleDisplay}`} passHref>
        <a className="flex flex-col mb-2 no-click h-full" onClick={() => {}}>
          <div className="flex flex-col h-full flex-grow">
            <div className="flex gap-x-2 items-center">
              <Image
                src={data.avatar}
                width={40}
                height={40}
                className="rounded-full"
                alt={`${data.name}의 프로필 사진`}
              />
              <div className="flex flex-col">
                <div className="text-title-color">{data.name}</div>
                <div className="text-description-color text-sm">{`@${data.handleDisplay}`}</div>
              </div>
            </div>
            <div className="text-description-color mt-2 text-sm">{data.introduce}</div>
            <div className="flex gap-x-2 mt-2">
              {data.roles?.map((item, index) => (
                <div key={index} className="tag small">
                  {item.name}
                </div>
              ))}
            </div>
            {data.links.length > 0 && (
              <div className="mt-2">
                {data.links.map((link: any, index) => (
                  <a key={index} href={link?.url ?? ''} className="title-highlight">
                    {link?.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-around w-full mt-2.5 flex-grow-0">
            <div className="flex-col text-center">
              <div className="font-semibold text-title-color">작성글</div>
              <div className="text-subtitle-color text-sm">{data._count.posts}</div>
            </div>
            <div className="flex-col text-center">
              <div className="font-semibold text-title-color">가입일</div>
              <div className="text-subtitle-color text-sm">
                {relativeTimeFormat(data.createdAt)}
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}
