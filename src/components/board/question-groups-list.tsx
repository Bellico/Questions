import { getGroupsListQuery } from '@/actions/queries'
import { AlertDraft } from '@/components/board/alert-draft'
import { QuestionGroupsListActions } from '@/components/board/question-groups-list-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { auth } from '@/lib/auth'
import { Group, MoreHorizontal, Pencil, Play, Plus } from 'lucide-react'
import Link from 'next/link'

export async function QuestionGroupsList() {
  const session = await auth()

  const questionGroups = await getGroupsListQuery(session?.user.id!)

  if (questionGroups.length == 0) {
    return (
      <section className="py-12">
        <div className="container">

          <h1 className="mb-12 text-center text-5xl font-extrabold">
            Questions
          </h1>

          <div className="h-16 rounded-lg border-2 border-dashed border-slate-700 hover:border-solid">
            <Link href="/editor">
              <div className="flex h-full items-center justify-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                Add your first group of questions
              </div>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="animate-zoomInEditor py-12">
      <div className="container">

        <h1 className="mb-12 text-center text-5xl font-extrabold">
         Questions
        </h1>

        <AlertDraft />

        <div className="my-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {questionGroups.map((group) => (
            <Card className="q-card" key={group.id}>
              <CardHeader className="flex flex-row items-center text-xl font-bold">
                <div>
                  <Group className="mr-2 size-8" />
                </div>
                <div>
                  {group.name}
                  <span className="text-xs">(v{group.version})</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-sm'>{group._count.questions} questions</div>
                <div className='text-sm'>10 try</div>
                <div className='text-sm'>9 success</div>
                <div className="mt-4">
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

          <div className="rounded-lg border-2 border-dashed border-slate-700 hover:border-solid">
            <Link href="/editor">
              <div className="flex h-full items-center justify-center">
                <Plus className="size-10" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
