import { HomeHeroLogin } from '@/components/layouts/home-hero-login'

export default async function HomePageLogin({
  searchParams
}: {
searchParams?: { email: string }
}) {
  return <HomeHeroLogin email={searchParams?.email!} />
}
