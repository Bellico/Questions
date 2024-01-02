import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: undefined | PrismaClient // eslint-disable-line
}

const prisma = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma
