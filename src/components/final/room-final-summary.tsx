import { getRoomFinalScore } from '@/actions/queries'
import { Spinner } from '@/components/commons/spinner'
import { RoomFinalHeroStats } from '@/components/final/room-final-hero-stats'
import { Suspense } from 'react'

export async function RoomFinalSummary({roomId} : { roomId: string}) {
  const stats = await getRoomFinalScore(roomId)

  return(
    <div className="space-y-3 text-xl sm:space-y-5 sm:text-3xl">
      <div className="animate-fadeIn opacity-0 delay-500">Score {stats.score}%</div>
      <div className="animate-fadeIn opacity-0 delay-700">Success {stats.success}/{stats.count}</div>
      <div className="animate-fadeIn opacity-0 delay-1000">Failed {stats.failed}/{stats.count}</div>
    </div>
  )
}
