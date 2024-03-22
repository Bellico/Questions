import { canViewRoomQuery } from '@/actions/queries'
import { Spinner } from '@/components/commons/spinner'
import { RoomFinalResume } from '@/components/final/room-final-resume'
import { RoomFinalSummary } from '@/components/final/room-final-summary'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function ResultsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  const room = await canViewRoomQuery(params.id, session!.user.id!)

  if(!room){
    notFound()
  }

  return (
    <>
      <RoomFinalSummary roomId={params.id} canRetry={false} />
      <Suspense fallback={<Spinner />} >
        <RoomFinalResume roomId={params.id} />
      </Suspense>
    </>
  )
}
