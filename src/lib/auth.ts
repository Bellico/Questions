import { sendVerificationAuthToken } from '@/lib/send-verification-auth-token'
/* @ts-ignore */
import prisma from '@/lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import type { DefaultSession } from 'next-auth'
import { NextAuthOptions, getServerSession } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: DefaultSession['user'] & {
      /** The user's postal address. */
      id?: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  /* @ts-ignore */
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url }) {
        await sendVerificationAuthToken(email, url)
      },
    }),
  ],
  pages: {
    error: '/'
  },
  callbacks: {
    session({ session, user }) {
      if (!session?.user) return session

      session.user.id = user.id
      return session
    },
  },
  debug: false, // process.env.NODE_ENV === 'development'
}

export const getAuthSession = async () => getServerSession(authOptions)

export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}
