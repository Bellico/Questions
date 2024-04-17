import { AnwsersChart } from '@/components/board-group/answers-chart'
import { AnswersTable } from '@/components/board-group/answers-table'
import { getAnwsersBoardQuery } from '@/queries/pages-queries'
import { translate } from '@/queries/utils-queries'

export async function AnswersList({ userId, groupId } : { userId: string, groupId: string}) {
  const { t } = await translate('global')
  const answersList = await getAnwsersBoardQuery(groupId, userId)

  const chartDatas = answersList.map(row => ({
    name: row.title,
    value : row.successCount
  }))

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold ">{t('AverageResults')} ({answersList.length})</h2>
      <p className="text-muted-foreground">{t('AverageResultsDesc')}</p>

      <div className="flex flex-col justify-center gap-4 lg:flex-row">
        <div className="flex-auto">
          <AnswersTable answersList={answersList} />
        </div>

        <div className="flex-1">
          <AnwsersChart data={chartDatas} />
        </div>
      </div>
    </div>
  )
}
