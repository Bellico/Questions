import { HomeHeader } from '@/components/layouts/home-header'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session) {
    redirect('/board')
  }

  return (
    <>
      <HomeHeader />
      <main>
        {children}
      </main>
      {/* <HomeFooter /> */}
    </>
  )
}
