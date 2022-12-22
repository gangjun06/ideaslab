import { Dialog, Transition } from '@headlessui/react'
import {
  ArchiveBoxIcon,
  ChatBubbleLeftRightIcon,
  LinkIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import Image from 'next/image'
import { Fragment, ReactNode, Suspense, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { appRouter } from '~/../../server/src/router/_app'
import { useDisclosure } from '~/hooks/useDisclosure'
import { trpc } from '~/lib/trpc'
import { Unarray } from '~/types/utils'
import { fullTimeFormat, relativeTimeFormat } from '~/utils/time'
import { Button, ButtonLink, TransitionChild } from './common'

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
      <GalleryDetailModal show={showDetailModal} onClose={onClose} id={id} />
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
      className="bg-white dark:bg-gray-700/50 dark:border-base-dark rounded galleryUploadCard relative flex flex-col px-4 py-4"
      key={post.id}
      onClick={onClick}
    >
      {image && (
        <div className="mb-2 w-full flex items-center justify-center">
          <Image
            src={image.url}
            width={image.width}
            height={image.height}
            alt="image"
            className="rounded-lg"
          />
        </div>
      )}
      <div className="flex gap-x-2 items-center mb-2">
        <Image
          src={post.author.avatar}
          width={48}
          height={48}
          className="rounded-full"
          alt="avatar image"
        />
        <div className="flex flex-col justify-center">
          <div className="text-title-color">{post.author.name}</div>
          <div className="text-description-color text-sm">{relativeTimeFormat(post.createdAt)}</div>
        </div>
      </div>
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

export const GalleryDetailModal = ({
  id,
  show,
  onClose,
}: {
  id?: number | null
  show: boolean
  onClose: () => void
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild type="overlay">
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto sm:p-5">
          <div className="flex items-center justify-center text-center h-full min-h-full w-full">
            <TransitionChild type="modal">
              <Dialog.Panel
                className={classNames(
                  'bg-base h-full text-base-color w-full max-w-full lg:max-w-4xl transform sm:rounded-xl text-left align-middle shadow-xl backdrop-blur-md transition-all flex flex-col',
                )}
              >
                <Suspense
                  fallback={
                    <>
                      <div className="animate-pulse flex flex-col px-8 mt-8 gap-y-4">
                        <div className="flex justify-between items-center">
                          <div className="h-12 bg-gray-800 rounded w-48"></div>
                          <Button variant="subtle" onClick={onClose} forIcon>
                            <XMarkIcon width={24} height={24} />
                          </Button>
                        </div>
                        <div className="h-12 bg-pulse rounded mt-4 w-80"></div>
                        <div className="h-96 bg-pulse rounded w-full"></div>
                        <div className="mt-8 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
                        <div className="mt-4 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
                        <div className="mt-4 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
                        <div className="mt-4 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
                        <div className="mt-4 h-24 bg-pulse rounded-lg w-3/5 mx-auto"></div>
                      </div>
                    </>
                  }
                >
                  <DetailContent id={id} onClose={onClose} />
                </Suspense>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export const DetailContent = ({ id, onClose }: { id?: number | null; onClose: () => void }) => {
  const { data } = trpc.gallery.postDetail.useQuery(
    { id: id ?? 0 },
    { enabled: typeof id === 'number', suspense: true },
  )

  return <PostDetail forDialog onClose={onClose} post={data} />
}

export const PostDetail = ({
  post,
  onClose,
  forDialog = false,
}: {
  post?: Unarray<typeof appRouter.gallery.postDetail['_def']['_output_out']>
  onClose: () => void
  forDialog?: boolean
}) => {
  if (!post) return <></>
  return (
    <>
      {forDialog && (
        <Dialog.Title
          as="h3"
          className="w-full px-6 py-5 text-2xl font-medium leading-6 text-title-color flex justify-between items-center"
        >
          <div>{post.title ?? '이미지 상세보기'}</div>
          {onClose && (
            <Button forIcon variant="subtle" onClick={onClose}>
              <XMarkIcon className="w-5 h-5" />
            </Button>
          )}
        </Dialog.Title>
      )}
      <div
        className={classNames(
          forDialog && 'px-6 py-2 pb-5',
          'text-base-color overflow-y-auto custom-scroll flex-1',
        )}
      >
        <div className="flex gap-x-2 items-center">
          <Image
            src={post.author.avatar}
            width={48}
            height={48}
            className="rounded-full"
            alt="avatar image"
          />
          <div className="flex flex-col justify-center">
            <div className="text-title-color">{post.author.name}</div>
            <div className="text-description-color text-sm">{fullTimeFormat(post.createdAt)}</div>
          </div>
        </div>
        <div className="mt-5 mb-5 flex gap-2 items-center flex-wrap">
          <div className="tag">
            <ArchiveBoxIcon width={24} height={24} />
            {post.category.name}
          </div>
          {post.tags.length > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-300"></div>
          )}
          {post.tags.map(({ name }) => (
            <div className="tag">
              <TagIcon width={24} height={24} />
              {name}
            </div>
          ))}
        </div>
        <ReactMarkdown className="prose max-w-none prose-strong:text-gray-800 dark:prose-strong:text-gray-200 text-base-color">
          {post.content.replace(/\n/g, '\n\n')}
        </ReactMarkdown>
        <div className="mt-4 flex flex-col items-center justify-center gap-3">
          {post.attachments.map((image) => {
            if ((image as any)?.contentType?.startsWith('image/')) {
              return (
                <Image
                  // @ts-ignore
                  src={image?.url ?? ''}
                  // @ts-ignore
                  width={image?.width ?? 0}
                  // @ts-ignore
                  height={image?.height ?? 0}
                />
              )
            }
          })}
        </div>
        <div className="flex gap-x-2 mt-4 w-full items-center justify-center">
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
        <section className="bg-white dark:bg-gray-900 py-8 lg:py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                디스코드 댓글
              </h2>
            </div>
            {post.comments.map(({ parent, ...comment }) => (
              <Comment
                key={comment.discordId}
                avatar={comment.author.avatar}
                username={comment.author.name}
                content={comment.content}
                time={relativeTimeFormat(comment.createAt)}
                parent={
                  parent && {
                    avatar: parent.author.avatar,
                    content: parent.content,
                    username: parent.author.name,
                  }
                }
              />
            ))}
          </div>
        </section>
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
  time: string
  content: string
  username: string
  parent?: {
    avatar: string
    username: string
    content: string
  } | null
}) => {
  return (
    <article className={classNames('p-4 mb-6 text-base card')}>
      {parent && (
        <div className="flex mb-3 card px-2 py-2 items-center">
          <Image
            width={24}
            height={24}
            className="rounded-full"
            src={parent.avatar}
            alt="reply from"
          />
          <div className="ml-1 text-sm">{parent.username}</div>
          <div className="ml-2 text-description-color text-ellipsis text-sm">{parent.content}</div>
        </div>
      )}
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
            <img className="mr-2 w-6 h-6 rounded-full" src={avatar} alt="Bonnie Green" />
            {username}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2022-03-12" title="March 12th, 2022">
              {time}
            </time>
          </p>
        </div>
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{content}</p>
    </article>
  )
}
