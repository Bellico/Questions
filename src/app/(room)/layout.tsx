import { RoomFooter } from '@/components/dashboard-layout/footer'
import { RoomHeader } from '@/components/dashboard-layout/header'
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
      <RoomFooter />
    </>
  )
}
