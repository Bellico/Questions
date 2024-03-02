import { canViewRoomQuery } from '@/actions/queries'
import { Spinner } from '@/components/commons/spinner'
import { RoomFinalResume } from '@/components/final/room-final-resume'
import { RoomFinalRetry } from '@/components/final/room-final-retry'
import { RoomFinalSummary } from '@/components/final/room-final-summary'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function RoomPage({
  params,
  searchParams
}: {
  params: { id: string },
  searchParams?: { shareLink?: string }
}) {
  const session = await auth()
  const room = await canViewRoomQuery(params.id, session?.user.id, searchParams?.shareLink)

  if(!room || !room.withResults){
    redirect('/')
  }

  return (
    <>
      <RoomFinalSummary roomId={room.id} />
      {/* <RoomFinalRetry roomId={room.id} shareLink={searchParams?.shareLink} /> */}
      <Suspense fallback={<Spinner />} >
        <RoomFinalResume roomId={room.id} />
      </Suspense>
    </>
  )
}
