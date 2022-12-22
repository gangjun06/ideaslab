import { Dialog, Transition } from '@headlessui/react'
import { ArchiveBoxIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import Image from 'next/image'
import { Fragment, ReactNode, Suspense, useCallback, useMemo, useState } from 'react'
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
        <div className="mb-2">
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
                  'bg-base h-full text-base-color w-full max-w-full xl:max-w-5xl transform sm:rounded-xl text-left align-middle shadow-xl backdrop-blur-md transition-all flex flex-col',
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
        <div className="my-3 flex">
          <div className="tag">
            <ArchiveBoxIcon width={24} height={24} />
            {post.category.name}
          </div>
        </div>
        {post.content}
      </div>
    </>
  )
}
