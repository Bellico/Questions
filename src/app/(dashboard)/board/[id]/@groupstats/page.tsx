import { BoardStats } from '@/components/board/stats'
import { Spinner } from '@/components/commons/spinner'
import { auth } from '@/lib/auth'
import { translate } from '@/queries/utils-queries'
import { Suspense } from 'react'

export default async function GroupStatsPage({
  params,
}: {
  params: { id: string }
}) {
  const { t } = await translate('global')

  const session = await auth()

  return (
    <section>
      <div className="container">
        <h1 className="title">{t('BoardStats')}</h1>

        <Suspense fallback={<Spinner />}>
          <BoardStats userId={session?.user.id!} groupId={params.id} />
        </Suspense>

      </div>
    </section>
  )
}
