import { getGroupsListQuery } from '@/actions/queries'
import { QuestionGroupNew } from '@/components/board/question-group-new'
import { QuestionGroupsListActions } from '@/components/board/question-groups-list-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BarChart3, Group, MoreHorizontal, Pencil, Play, Plus } from 'lucide-react'
import Link from 'next/link'

export async function QuestionGroupsList({userId} : { userId: string}) {
  const questionGroups = await getGroupsListQuery(userId)

  if (questionGroups.length == 0) {
    return(
      <QuestionGroupNew className="h-16">
        <span>Add your first group of questions</span>
      </QuestionGroupNew>
    )
  }

  return (
    <div className="my-5 grid animate-fadeIn gap-4 md:grid-cols-2 lg:grid-cols-4">
      {questionGroups.map((group) => (
        <Card className="q-card" key={group.id}>
          <CardHeader className="flex flex-row items-center pb-2 text-lg  font-bold">
            <div>
              <Group className="mr-2 size-8" />
            </div>
            <div className="flex">
              <div>{group.name}</div>
              <div className="ml-1 text-xs">(v{group.version})</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-sm">Questions: <span className="text-second">{group.questionsCount}</span></div>
              {group.lastScore !== null &&
                <div className="text-sm">
                  Last: <span className="font-medium text-primary">{group.lastScore}%</span>
                  <span className="text-second"> - {group.lastTryDate?.toLocaleString('fr-fr')}</span>
                </div>
              }
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={`/start/${group.id}`}>
                <Button>
                  <Play className="mr-2 size-4" />
                      Start
                </Button>
              </Link>

              <Link href={`/editor/${group.id}`}>
                <Button variant="secondary">
                  <Pencil className="mr-2 size-4" />
                      Edit
                </Button>
              </Link>

              {group.resultsCount > 0 &&
                <Link href={`/board/${group.id}`}>
                  <Button variant="secondary">
                    <BarChart3 className="mr-2 size-4" />
                      Results ({group.resultsCount})
                  </Button>
                </Link>
              }

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <QuestionGroupsListActions groupId={group.id} />
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}

      <QuestionGroupNew>
        <Plus className="size-10" />
      </QuestionGroupNew>
    </div>
  )
}
