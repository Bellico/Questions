import { QuestionGroupsList } from '@/components/board/question-groups-list'
import { BoardStats } from '@/components/board/stats'
import { SectionSpinner } from '@/components/commons/spinner'
import { DashboardFooter } from '@/components/dashboard-layout/footer'
import { Suspense } from 'react'

export default async function BoardPage() {
  return (
    <>
      <Suspense fallback={<SectionSpinner title="Board stats" className='bg-accent shadow-md' />}>
        <BoardStats />
      </Suspense>

      <Suspense fallback={<SectionSpinner title="Question groups" />}>
        <QuestionGroupsList />
      </Suspense>

      <DashboardFooter />
    </>
  )
}
