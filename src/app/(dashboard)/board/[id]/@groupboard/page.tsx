import { getGroupName } from '@/actions/queries'
import { QuestionGroupBoard } from '@/components/board/question-group-board'
import { Spinner } from '@/components/commons/spinner'
import { auth } from '@/lib/auth'
import { Suspense } from 'react'

export default async function GroupBoardPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  return (
    <div className="bg-accent">
      <section>
        <div className="container">
          <h1 className="title">{await getGroupName(params.id)}</h1>

          <Suspense fallback={<Spinner />}>
            <QuestionGroupBoard userId={session?.user.id!} groupId={params.id} />
          </Suspense>

        </div>
      </section>
    </div>
  )
}
