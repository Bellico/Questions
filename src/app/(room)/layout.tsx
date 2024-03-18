import { RoomHeader } from '@/components/board-layout/header'
import { Loader } from '@/components/commons/loader'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'

export default async function RoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <RoomHeader />
      <main>
        {children}
      </main>
      <Loader />
      <Toaster />
    </>
  )
}
