import { Spinner } from '@/components/commons/spinner'
import { RoomFinalHeroStats } from '@/components/final/room-final-hero-stats'
import { Button } from '@/components/ui/button'
import { ArrowDownToLine, Group, ListRestart } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export function RoomFinalHero({roomId} : { roomId: string}) {
  return(
    <section className="relative flex min-h-[calc(100vh-65px)] items-center justify-center">
      <div className="container mt-[-65px] flex flex-col items-center space-y-7 text-center sm:space-y-10">

        <div className="animate-room-final">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              All questions are completed !
          </h1>
        </div>

        <Suspense fallback={<Spinner />}>
          <RoomFinalHeroStats roomId={roomId} />
        </Suspense>

        <div className="animate-fadeIn opacity-0 delay-1000">
          <Link href={'/start/1'}>
            <Button className="mr-4 sm:w-36">
              <ListRestart className="mr-2" />
                Retry
            </Button>
          </Link>

          <Link href={'/board'}>
            <Button variant="secondary" className="mr-4 sm:w-36">
              <Group className="mr-2" />
                Leave
            </Button>
          </Link>
        </div>

      </div>

      <div className="absolute inset-x-0 bottom-0 flex animate-bounce flex-col items-center">
        <p>Scroll to yours results</p>
        <ArrowDownToLine />
      </div>
    </section>
  )
}
