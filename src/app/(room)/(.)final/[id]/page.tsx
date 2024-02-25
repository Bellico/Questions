import { canViewRoomQuery } from '@/actions/queries'
import { Spinner } from '@/components/commons/spinner'
import { RoomFinalHero } from '@/components/final/room-final-hero'
import { RoomFinalHeroStats } from '@/components/final/room-final-hero-stats'
import { RoomFinalResume } from '@/components/final/room-final-resume'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function RoomPage({
  params
}: {
params: { id: string, shareLink?: string }
}) {
  const session = await auth()
  const room = await canViewRoomQuery(params.id, session?.user.id, params.shareLink)
  if(!room){
    redirect('/')
  }

  if(!room.withResults){
    return(
      <RoomFinalHero canScroll={false} />
    )
  }

  return (
    <>
      <RoomFinalHero canScroll={true} >
        <Suspense fallback={<Spinner />}>
          <RoomFinalHeroStats roomId={room.id} />
        </Suspense>
      </RoomFinalHero>

      <Suspense fallback={<Spinner />}>
        <RoomFinalResume roomId={room.id} />
      </Suspense>
    </>
  )
}
