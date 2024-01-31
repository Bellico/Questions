import { RoomFooter } from '@/components/dashboard-layout/footer'
import { RoomHeader } from '@/components/dashboard-layout/header'
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
      <Toaster />
      <RoomFooter />
    </>
  )
}
