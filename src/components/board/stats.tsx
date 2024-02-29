import { getStatsQuery } from '@/actions/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BoxIcon, FileQuestion, ThumbsDown, ThumbsUp } from 'lucide-react'

export const BoardStats = async ( {userId} : { userId: string}) => {
  const { groupCount, questionCount } = await getStatsQuery(userId)

  return (
    <div className="my-5 grid animate-fadeIn gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
                Total Groups
          </CardTitle>
          <BoxIcon className="size-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{groupCount}</div>
          <p className="text-second text-xs">+10.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
                Total Questions
          </CardTitle>
          <FileQuestion className="size-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{questionCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successed</CardTitle>
          <ThumbsUp className="size-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">?</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <ThumbsDown className="size-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">?</div>
        </CardContent>
      </Card>
    </div>
  )
}
