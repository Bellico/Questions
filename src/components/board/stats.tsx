import { getGroupStatsQuery, getStatsQuery } from '@/actions/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { secondsToDhms } from '@/lib/utils'
import { Award, BoxIcon, History, XCircle } from 'lucide-react'

export const BoardStats = async ({ userId, groupId } : { userId: string , groupId?: string}) => {
  const stats = groupId ?
    await getGroupStatsQuery(userId, groupId) :
    await getStatsQuery(userId)

  return (
    <div className="my-5 grid animate-fadeIn grid-cols-2 gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Questions
          </CardTitle>
          <BoxIcon className="size-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.questionCount > 0 ? stats.questionCount : '...'}</div>
          {stats.groupCount > 1 && <p className="text-second text-xs">{stats.groupCount} Groups</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Score
          </CardTitle>
          <Award className="size-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.avgScore !== null ? stats.avgScore + ' %' : '...'}</div>
          { stats.roomCount > 0 &&
            <p className="text-second text-xs">{stats.roomCount} ratings</p>
          }
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <XCircle className="size-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.answerCount > 0 ? stats.answerFailedCount : '...'}</div>
          {stats.answerCount > 0 && <p className="text-second text-xs">{stats.answerCount} answers</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average response time</CardTitle>
          <History className="size-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary"> {stats.avgAnwserTime > 0 ? secondsToDhms(stats.avgAnwserTime) : '...'}</div>
          {stats.totalTime > 0 && <p className="text-second text-xs">{secondsToDhms(stats.totalTime)} (total time)</p>}
        </CardContent>
      </Card>
    </div>
  )
}
