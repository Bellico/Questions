import { Spinner } from '@/components/commons/spinner'
import { RoomFinalResume } from '@/components/final/room-final-resume'
import { RoomFinalSummary } from '@/components/final/room-final-summary'
import { auth } from '@/lib/auth'
import { canViewFinalRoomQuery } from '@/queries/pages-queries'
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
  const room = await canViewFinalRoomQuery(params.id, session?.user.id, searchParams?.shareLink)

  if(!room || !room.withResults){
    redirect('/')
  }

  return (
    <>
      <RoomFinalSummary roomId={room.id} canRetry={(room.withRetry || 0) > 0} shareLink={searchParams?.shareLink}/>
      <Suspense fallback={<Spinner />} >
        <RoomFinalResume roomId={room.id} />
      </Suspense>
    </>
  )
}
