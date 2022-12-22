import { detailValidator, galleryPostsValidator } from '@ideaslab/validator'
import { publicProcedure, router } from '~/api/trpc'
import { dbClient, Prisma } from '@ideaslab/db'

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
    const res = await dbClient.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        discordId: true,
        title: true,
        createdAt: true,
        updateAt: true,
        tags: {
          select: {
            name: true,
          },
        },
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
        comments: {
          select: {
            discordId: true,
            content: true,
            createdAt: true,
            hasParent: true,
            author: {
              select: {
                avatar: true,
                name: true,
              },
            },
            parent: {
              select: {
                discordId: true,
                content: true,
                author: {
                  select: {
                    avatar: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    return res
  }),
  categories: publicProcedure.query(async () => {
    return await dbClient.category.findMany({ select: { name: true, id: true } })
  }),
})
