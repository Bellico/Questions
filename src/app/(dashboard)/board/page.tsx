import { QuestionGroupsList } from '@/components/board/question-groups-list'
import { BoardStats } from '@/components/board/stats'
import { SectionSpinner } from '@/components/commons/spinner'
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

      <svg className='fixed bottom-0 -z-10 fill-primary/65 dark:fill-primary/10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path d="M0,96L80,80C160,64,320,32,480,58.7C640,85,800,171,960,170.7C1120,171,1280,85,1360,42.7L1440,0L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
    </>
  )
}
