import { PrismaClient } from '@prisma/client'

declare global {
  var dbClient: PrismaClient | undefined
}

export const dbClient: PrismaClient = global.dbClient || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.dbClient = dbClient

