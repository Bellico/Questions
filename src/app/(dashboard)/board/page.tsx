import { AlertDraft } from '@/components/board/alert-draft'
import { QuestionGroupsList } from '@/components/board/question-groups-list'
import { SharingGroupsList } from '@/components/board/sharing-groups-list'
import { BoardStats } from '@/components/board/stats'
import { Spinner } from '@/components/commons/spinner'
import { auth } from '@/lib/auth'
import { translate } from '@/queries/utils-queries'
import { Suspense } from 'react'

export default async function BoardPage() {
  const { t } = await translate('global')
  const session = await auth()

  return (
    <>
      <section className="bg-accent shadow-md">
        <div className="container">
          <h1 className="title">{t('BoardStats')}</h1>

          <Suspense fallback={<Spinner />}>
            <BoardStats userId={session?.user.id!} />
          </Suspense>

        </div>
      </section>

      <section>
        <div className="container">
          <h1 className="title">{t('Questions')}</h1>
          <AlertDraft />

          <Suspense fallback={<Spinner />}>
            <QuestionGroupsList userId={session?.user.id!} />
          </Suspense>

        </div>
      </section>

      <section>
        <div className="container">

          <Suspense fallback={<Spinner />}>
            <SharingGroupsList userId={session?.user.id!} />
          </Suspense>

        </div>
      </section>
    </>
  )
}
