import { Fragment, ReactNode, Suspense, useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArchiveBoxIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import toast from 'react-hot-toast'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

import { appRouter } from '@ideaslab/server/app'

import { useDisclosure } from '~/hooks/useDisclosure'
import { trpc } from '~/lib/trpc'
import { Unarray } from '~/types/utils'
import { fullTimeFormat, relativeTimeFormat } from '~/utils'

import { Button, ButtonLink, Dialog } from './common'

export const PostDetailModalWrapper = ({
  baseUrl = '',
  children,
}: {
  children: ({ showDetail }: { showDetail: (id: number) => void }) => ReactNode
  baseUrl?: string
}) => {
  const [showDetailModal, handleShowDetailModal] = useDisclosure()
  const [id, setId] = useState<number | null>(null)

  const showDetail = useCallback(
    (id: number) => {
      setId(id)
      window.history.pushState(null, '', `/gallery/${id}`)
      handleShowDetailModal.open()
    },
    [handleShowDetailModal],
  )

  const onClose = useCallback(() => {
    handleShowDetailModal.close()
    window.history.pushState(null, '', baseUrl)
  }, [baseUrl, handleShowDetailModal])

  return (
    <>
      <Dialog isOpen={showDetailModal} close={onClose}>
        <GalleryDetailModal id={id} />
      </Dialog>
      {children({ showDetail })}
    </>
  )
}

export const PostView = ({
  post,
  onClick,
}: {
  post: Unarray<typeof appRouter.gallery.posts['_def']['_output_out']>
  onClick?: () => void
}) => {
  const image = useMemo(() => {
    if (post.attachments.length === 0) return null
    return post.attachments[0] as { url: string; width: number; height: number }
  }, [post])

  return (
    <div
      className="bg-white dark:bg-gray-700/50 border-base-color rounded-lg galleryUploadCard relative flex flex-col px-4 py-4 drop-shadow-sm border"
      key={post.id}
      onClick={(e) => {
        if (
          (e.target as HTMLElement).classList.contains('no-click') ||
          (e.target as HTMLElement).parentElement?.classList.contains('no-click')
        )
          return
        if (typeof onClick === 'function') onClick()
      }}
    >
      {image && (
        <div className="mb-2 w-full flex items-center justify-center">
          <Image
            src={image.url}
            width={image.width}
            height={image.height}
            alt=""
            className="rounded-lg"
          />
        </div>
      )}
      <Link href={`/@${post.author.handle}`} passHref>
        <a className="flex gap-x-2 items-center mb-2 no-click">
          <Image
            src={post.author.avatar}
            width={48}
            height={48}
            className="rounded-full no-click"
            alt=""
          />
          <div className="flex flex-col justify-center no-click">
            <div className="text-title-color">{post.author.name}</div>
            <div className="text-description-color text-sm">
              {relativeTimeFormat(post.createdAt)}
            </div>
          </div>
        </a>
      </Link>
      <div className="text-title-color">{post.title}</div>
      <div className="text-description-color text-sm mb-2">
        {post.content.length > 300 ? post.content.slice(0, 300) + ' ...' : post.content}
      </div>

      <div className="flex">
        <div className="tag">
          {/* <TagIcon width={24} height={24} /> */}
          {post.category.name}
        </div>
      </div>
    </div>
  )
}

const PostLoadingInner = () => (
  <>
    <div className="h-12 bg-pulse rounded mt-4 w-80"></div>
    <div className="h-96 bg-pulse rounded w-full"></div>
    <div className="mt-8 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
    <div className="mt-4 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
    <div className="mt-4 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
    <div className="mt-4 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
    <div className="mt-4 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
  </>
)

export const PostLoading = () => (
  <div
    className="animate-pulse flex flex-col px-8 mt-8 gap-y-4 lg:max-w-4xl"
    role="presentation"
    aria-label="데이터 불러오는중"
  >
    <div className="flex justify-between items-center">
      <div className="h-12 bg-pulse rounded w-48"></div>
    </div>
    <PostLoadingInner />
  </div>
)

export const GalleryDetailModal = ({ id }: { id?: number | null }) => {
  return (
    <Dialog.Content>
      <Suspense
        fallback={
          <Dialog.Loading>
            <PostLoadingInner />
          </Dialog.Loading>
        }
      >
        <DetailContent id={id} />
      </Suspense>
    </Dialog.Content>
  )
}

export const DetailContent = ({ id }: { id?: number | null }) => {
  const { data } = trpc.gallery.postDetail.useQuery(
    { id: id ?? 0 },
    { enabled: typeof id === 'number', suspense: true },
  )

  return <PostDetail forDialog post={data} />
}

export const PostDetail = ({
  post,
  forDialog = false,
}: {
  post?: Unarray<typeof appRouter.gallery.postDetail['_def']['_output_out']>
  forDialog?: boolean
}) => {
  if (!post) return <></>
  return (
    <>
      {forDialog && <Dialog.Title title={post.title ?? '이미지 상세보기'} />}
      <div
        className={classNames(
          forDialog && 'px-6 py-2 pb-5',
          'text-base-color overflow-y-auto custom-scroll flex-1',
        )}
      >
        <Link href={`/@${post.author.handle}`} passHref>
          <a className="flex gap-x-2 items-center">
            <Image
              src={post.author.avatar}
              width={48}
              height={48}
              className="rounded-full"
              alt=""
            />
            <div className="flex flex-col justify-center">
              <div className="text-title-color">{post.author.name}</div>
              <time
                className="text-description-color text-sm"
                dateTime={post.createdAt.toISOString()}
              >
                {fullTimeFormat(post.createdAt)}
              </time>
            </div>
          </a>
        </Link>
        <div className="mt-5 mb-5 flex gap-2 items-center flex-wrap">
          <div className="tag">
            <ArchiveBoxIcon width={24} height={24} />
            {post.category.name}
          </div>
          {post.tags.length > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-300"></div>
          )}
          {post.tags.map(({ name, id }) => (
            <div className="tag" key={id}>
              <TagIcon width={24} height={24} />
              {name}
            </div>
          ))}
        </div>
        <ReactMarkdown className="max-w-none markdown">
          {post.content.replace(/\n/g, '\n\n')}
        </ReactMarkdown>
        <div className="mt-4 flex flex-col items-center justify-center gap-3">
          {post.attachments.map((image, index) => {
            if ((image as any)?.contentType?.startsWith('image/')) {
              return (
                <Image
                  key={index}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  src={image?.url ?? ''}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  width={image?.width ?? 0}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  height={image?.height ?? 0}
                  alt="첨부한 이미지"
                />
              )
            }
          })}
        </div>
        <div className="flex gap-x-2 mt-4 w-full items-center justify-center flex-wrap">
          <Button
            variant="subtle"
            onClick={() => {
              navigator.clipboard.writeText(location.href)
              toast.success('링크가 복사되었어요.')
            }}
          >
            <>
              <LinkIcon width={24} height={24} />
              링크 복사
            </>
          </Button>
          <ButtonLink
            variant="subtle"
            href={`https://discord.com/channels/${process.env.NEXT_PUBLIC_GUILD_ID}/${post.discordId}`}
          >
            <>
              <ChatBubbleLeftRightIcon width={24} height={24} />
              디스코드에서 보기
            </>
          </ButtonLink>
        </div>
        {post.comments && (
          <section className="py-8 lg:py-16">
            <div className="max-w-2xl mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                  디스코드 댓글
                </h2>
              </div>
              {post.comments?.length === 0 && (
                <div>아직 작성된 댓글이 없어요. 디스코드에서 먼저 댓글을 남겨보세요!</div>
              )}
              {post.comments?.map(({ parent, ...comment }) => (
                <Comment
                  key={comment.discordId}
                  avatar={comment.author.avatar}
                  username={comment.author.name}
                  content={comment.content}
                  time={comment.createdAt}
                  parent={
                    parent
                      ? {
                          avatar: parent.author.avatar,
                          content: parent.content,
                          username: parent.author.name,
                        }
                      : comment.hasParent
                      ? { content: '원본 메시지가 삭제되었어요.' }
                      : null
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

const Comment = ({
  avatar,
  username,
  time,
  content,
  parent,
}: {
  avatar: string
  time: Date
  content: string
  username: string
  parent?: {
    avatar?: string
    username?: string
    content: string
  } | null
}) => {
  return (
    <article className={classNames('p-4 mb-6 text-base card')}>
      {parent && (
        <div className="flex mb-3 card px-2 py-2 items-center">
          {parent.avatar && (
            <Image width={24} height={24} className="rounded-full" src={parent.avatar} alt="" />
          )}
          {parent.username && <div className="ml-1.5 text-sm">{parent.username}</div>}
          <div className="ml-2 text-description-color text-ellipsis text-sm">{parent.content}</div>
        </div>
      )}
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
            <Image width={24} height={24} className="mr-2 rounded-full" src={avatar} alt="" />
            <div className="ml-1.5">{username}</div>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={time.toISOString()}>{relativeTimeFormat(time)}</time>
          </p>
        </div>
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{content}</p>
    </article>
  )
}
