import { detailValidator, galleryPostsValidator } from '@ideaslab/validator'
import { publicProcedure, router } from '~/api/trpc'
import { dbClient } from '@ideaslab/db'

export const galleryRouter = router({
  posts: publicProcedure.input(galleryPostsValidator).query(async ({ input }) => {
    const { limit, cursor, categoryIds } = input

    const result = await dbClient.post.findMany({
      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
            skip: 1,
          }
        : {}),
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        attachments: true,
        author: {
          select: {
            avatar: true,
            name: true,
            discordId: true,
          },
        },
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        content: true,
      },
      where: {
        categoryId: {
          in: (categoryIds ?? [])?.length > 0 ? categoryIds : undefined,
        },
      },
    })
    return result
  }),
  postDetail: publicProcedure.input(detailValidator).query(async ({ input: { id } }) => {
    return await dbClient.post.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        createdAt: true,
        updateAt: true,
        tags: true,
        content: true,
        attachments: true,
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        author: {
          select: {
            avatar: true,
            name: true,
            discordId: true,
          },
        },
      },
    })
  }),
  categories: publicProcedure.query(async () => {
    return await dbClient.category.findMany({ select: { name: true, id: true } })
  }),
})
