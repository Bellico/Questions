import { BoardHeader } from '@/components/board-layout/header'
import { Loader } from '@/components/commons/loader'
import { Toaster } from '@/components/ui/toaster'
import { auth } from '@/lib/auth'
import { getUsername } from '@/queries/pages-queries'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function BoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) {
    redirect('/')
  }

  const locale = cookies().get('locale')?.value ?? 'en'
  const username = await getUsername(session.user.id!)

  return (
    <>
      <BoardHeader locale={locale} username={username} />
      <main>
        {children}
      </main>
      <Loader />
      <Toaster />
    </>
  )
}
