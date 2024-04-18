import { HomeHeader } from '@/components/layouts/home-header'
import { HomeHero } from '@/components/layouts/home-hero'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth()

  if (session) {
    redirect('/board')
  }

  return (
    <>
      <HomeHeader />
      <main>
        <HomeHero />
        {/* <HomeFeatures /> */}
      </main>
      {/* <HomeFooter /> */}
    </>
  )
}
