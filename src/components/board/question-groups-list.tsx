import { getGroupsListQuery } from '@/actions/queries'
import { QuestionGroupsListActions } from '@/components/board/question-groups-list-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Group, MoreHorizontal, Pencil, Play, Plus } from 'lucide-react'
import Link from 'next/link'

export async function QuestionGroupsList({userId} : { userId: string}) {
  const questionGroups = await getGroupsListQuery(userId)

  if (questionGroups.length == 0) {
    return (
      <div className="h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-solid dark:border-gray-700/65">
        <Link href="/editor">
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Add your first group of questions
          </div>
        </Link>
      </div>
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
            <div>
              {group.name}
              <span className="ml-1 text-xs">(v{group.version})</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-sm">Questions: <span className="text-second">{group._count.questions}</span></div>
              {/* <div className="text-sm">Score: <span className="text-second">1/2</span></div> */}
              {/* <div className="text-sm">Pay number: <span className="text-second">1</span></div> */}
              {/* <div className="text-sm">Last pratice: <span className="text-second">21/23/1223</span></div> */}
            </div>
            <div>
              <Link href={`/start/${group.id}`}>
                <Button className="mr-4">
                  <Play className="mr-2 size-4" />
                      Start
                </Button>
              </Link>
              <Link href={`/editor/${group.id}`}>
                <Button className="mr-4" variant="secondary">
                  <Pencil className="mr-2 size-4" />
                      Edit
                </Button>
              </Link>
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

      <div className="rounded-lg border-2 border-dashed border-gray-300 hover:border-solid dark:border-gray-700/65">
        <Link href="/editor">
          <div className="flex h-full items-center justify-center">
            <Plus className="size-10 text-gray-400" />
          </div>
        </Link>
      </div>
    </div>
  )
}
