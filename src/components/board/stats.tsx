import { getStatsQuery } from "@/actions/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { BoxIcon, FileQuestion, ThumbsDown, ThumbsUp } from "lucide-react";

export const BoardStats = async () => {

  const session = await auth();

  const { groupCount, questionCount } = await getStatsQuery(session?.user.id!)

  if (groupCount === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <BoxIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{groupCount}</div>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">+10.1% from last month</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <FileQuestion className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{questionCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Successed</CardTitle>
              <ThumbsUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">?</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <ThumbsDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
