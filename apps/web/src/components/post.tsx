import { Dialog, Transition } from '@headlessui/react'
import { ArchiveBoxIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import Image from 'next/image'
import { Fragment, ReactNode, Suspense, useCallback, useMemo, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { appRouter } from '~/../../server/src/router/_app'
import { useDisclosure } from '~/hooks/useDisclosure'
import { trpc } from '~/lib/trpc'
import { Unarray } from '~/types/utils'
import { fullTimeFormat, relativeTimeFormat } from '~/utils/time'
import { Button, TransitionChild } from './common'

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
      <div className="text-description-color text-sm mb-2">{post.content}</div>

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
                      <div className="animate-pulse flex flex-col px-8 mt-8">
                        <div className="h-12 bg-gray-800 rounded w-24"></div>
                        <div className="h-96 bg-gray-800 rounded w-full mt-8"></div>
                        <div className="flex gap-x-4 mt-2">
                          <div className="h-24 bg-gray-800 rounded w-full"></div>
                          <div className="h-24 bg-gray-800 rounded w-full"></div>
                          <div className="h-24 bg-gray-800 rounded w-full"></div>
                          <div className="h-24 bg-gray-800 rounded w-full"></div>
                        </div>
                        <div className="ml-0 mt-8 h-12 bg-gray-800 rounded-full w-full"></div>
                        <div className="ml-0 mt-6 h-12 bg-gray-800 rounded-full w-full"></div>
                        <div className="ml-0 mt-6 h-12 bg-gray-800 rounded-full w-full"></div>
                        <div className="ml-0 mt-6 h-12 bg-gray-800 rounded-full w-full"></div>
                        <div className="ml-0 mt-6 h-12 bg-gray-800 rounded-full w-full"></div>
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
    { enabled: typeof id === 'number' },
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
          className="w-full px-6 pt-5 text-2xl font-medium leading-6 text-title-color flex justify-between items-center"
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
          forDialog && 'px-6 py-5',
          'text-base-color overflow-y-auto custom-scroll flex-1',
        )}
      >
        <div className="relative"></div>
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
        <section className="bg-white dark:bg-gray-900 py-8 lg:py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                댓글 (20)
              </h2>
            </div>
            <Comment
              avatar="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
              username="Michael Gough"
              time="Feb. 8, 2022"
              content="Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy."
              depth={1}
            />
            <Comment
              avatar="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
              username="Michael Gough"
              time="Feb. 8, 2022"
              content="Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy."
              depth={2}
            />
          </div>
        </section>
      </div>
    </>
  )
}

const Comment = ({
  depth,
  avatar,
  username,
  time,
  content,
}: {
  depth: number
  avatar: string
  time: string
  content: string
  username: string
}) => {
  return (
    <article
      className={classNames('p-4 mb-6 text-base card')}
      style={{ marginLeft: (depth - 1) * 24 }}
    >
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
