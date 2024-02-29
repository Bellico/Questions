import { AlertDraft } from '@/components/board/alert-draft'
import { QuestionGroupsList } from '@/components/board/question-groups-list'
import { BoardStats } from '@/components/board/stats'
import { Spinner } from '@/components/commons/spinner'
import { auth } from '@/lib/auth'
import { Suspense } from 'react'

export default async function BoardPage() {
  const session = await auth()

  return (
    <>
      <section className="hidden bg-accent shadow-md lg:block">
        <div className="container">
          <h1 className="title">Board stats</h1>

          <Suspense fallback={<Spinner />}>
            <BoardStats userId={session?.user.id!} />
          </Suspense>

        </div>
      </section>


      <section>
        <div className="container">
          <h1 className="title">Questions</h1>
          <AlertDraft />

          <Suspense fallback={<Spinner />}>
            <QuestionGroupsList userId={session?.user.id!} />
          </Suspense>

        </div>
      </section>
    </>
  )
}
