import { canViewRoom } from '@/actions/queries'
import { Spinner } from '@/components/commons/spinner'
import { RoomFinalHero } from '@/components/final/room-final-hero'
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
  const room = await canViewRoom(params.id, session?.user.id, params.shareLink)
  if(!room){
    redirect('/')
  }

  return (
    <>
      <RoomFinalHero roomId={room.id} />
      <Suspense fallback={<Spinner />}>
        <RoomFinalResume roomId={room.id} />
      </Suspense>
    </>
  )
}
