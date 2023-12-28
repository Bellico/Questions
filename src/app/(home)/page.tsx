import { HomeFooter } from "@/components/home-layout/footer";
import { HomeHeader } from "@/components/home-layout/header";
import { HomeHero } from "@/components/home-layout/hero";
import { auth } from "@/lib/auth";

export default async function HomePage() {

  const session = await auth();

  if (session) {
    // redirect('/questions')
  }

  return (
    <>
      <HomeHeader />
      <main>
        <HomeHero />
      </main>
      <HomeFooter />
    </>
  )
}
