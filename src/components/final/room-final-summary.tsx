import { Spinner } from '@/components/commons/spinner'
import { RoomFinalHeroStats } from '@/components/final/room-final-hero-stats'
import { Suspense } from 'react'

export function RoomFinalSummary({roomId} : { roomId: string}) {
  return(
    <section className="items-center justify-center">
      <div className="container mt-[-65px] flex flex-col items-center space-y-7 text-center sm:space-y-10">

        <div className="animate-room-final">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              All questions are completed !
          </h1>
        </div>

        <Suspense fallback={<Spinner />}>
          <RoomFinalHeroStats roomId={roomId} />
        </Suspense>

      </div>
    </section>
  )
}
