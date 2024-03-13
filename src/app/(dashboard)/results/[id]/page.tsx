import { Spinner } from '@/components/commons/spinner'
import { RoomFinalResume } from '@/components/final/room-final-resume'
import { RoomFinalSummary } from '@/components/final/room-final-summary'
import { Suspense } from 'react'

export default async function ResultsPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <>
      <RoomFinalSummary roomId={params.id} canRetry={false} />
      <Suspense fallback={<Spinner />} >
        <RoomFinalResume roomId={params.id} />
      </Suspense>
    </>
  )
}
