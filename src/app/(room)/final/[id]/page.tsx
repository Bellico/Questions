import { canViewRoomQuery } from '@/actions/queries'
import { Spinner } from '@/components/commons/spinner'
import { RoomFinalResume } from '@/components/final/room-final-resume'
import { RoomFinalSummary } from '@/components/final/room-final-summary'
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
  if(!room || !room.withResults){
    redirect('/')
  }

  return (
    <>
      <RoomFinalSummary roomId={room.id} />
      <Suspense fallback={<Spinner />}>
        <RoomFinalResume roomId={room.id} />
      </Suspense>
    </>
  )
}
