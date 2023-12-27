/* @ts-ignore */
import { sendVerificationAuthToken } from "@/lib/sendVerificationAuthToken";
/* @ts-ignore */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions, getServerSession } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  /* @ts-ignore */
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        await sendVerificationAuthToken(email, url)
      },
    }),
  ]
};

export const getAuthSession = async () => getServerSession(authOptions);

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, authOptions)
}

