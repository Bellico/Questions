import { getStatsQuery } from '@/actions/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/auth'
import { BoxIcon, FileQuestion, ThumbsDown, ThumbsUp } from 'lucide-react'

export const BoardStats = async () => {
  const session = await auth()

  const { groupCount, questionCount } = await getStatsQuery(session?.user.id!)

  if (groupCount === 0) {
    return null
  }

  return (
    <section className="bg-accent py-12 shadow-md">
      <div className="container">
        <div className="my-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Groups
              </CardTitle>
              <BoxIcon className="size-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{groupCount}</div>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">+10.1% from last month</p> */}
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
              <div className="text-2xl font-bold">{questionCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successed</CardTitle>
              <ThumbsUp className="size-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">?</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <ThumbsDown className="size-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">?</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
