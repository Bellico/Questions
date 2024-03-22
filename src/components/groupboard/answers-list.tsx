import { getAnwsersBoardQuery } from '@/actions/queries'
import { AnwsersChart } from '@/components/groupboard/answers-chart'
import { AnswersTable } from '@/components/groupboard/answers-table'

export async function AnswersList({ userId, groupId } : { userId: string, groupId: string}) {
  const answersList = await getAnwsersBoardQuery(groupId, userId)
  const chartDatas = answersList.map(row => ({
    name: row.title,
    value : row.successCount
  }))

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold ">Average by questions ({answersList.length})</h2>
      <p className="text-muted-foreground">Score detailed by questions (only me).</p>

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
