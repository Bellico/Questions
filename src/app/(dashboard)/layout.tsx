import { BoardHeader } from '@/components/board-layout/header'
import { Loader } from '@/components/commons/loader'
import { Toaster } from '@/components/ui/toaster'
import { auth } from '@/lib/auth'
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

  return (
    <>
      <BoardHeader />
      <main>
        {children}
      </main>
      <Loader />
      <Toaster />
    </>
  )
}
