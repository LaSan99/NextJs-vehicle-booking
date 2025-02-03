import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

// Log the DATABASE_URL (but mask sensitive info)
const dbUrl = process.env.DATABASE_URL || '';
console.log('Database URL format:', dbUrl.replace(/:.*@/, ':****@'));

const globalForPrisma = global
export const prisma = globalForPrisma.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}