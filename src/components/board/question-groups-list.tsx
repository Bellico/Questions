import { getGroupsListQuery } from "@/actions/queries";
import { QuestionGroupsListOptions } from "@/components/board/question-groups-list-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Group, MoreHorizontal, Pencil, Play, Plus } from "lucide-react";
import Link from "next/link";

export async function QuestionGroupsList() {
  const questionGroups = await getGroupsListQuery();

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl mb-12 text-center font-semibold">Question groups</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
          {questionGroups.map((group) => (
            <Card className="q-card" key={group.id}>
              <CardHeader className="flex flex-row items-center mb-4 text-xl font-bold">
                <div><Group className="mr-2 h-8 w-8" /></div>
                <div>{group.name}</div>
              </CardHeader>
              <CardContent>
                <div>4 questions</div>
                <div>10 try</div>
                <div>9 success</div>
                <div className="mt-8">
                  <Link href="/runner">
                    <Button className="mr-4"><Play className="mr-2 h-4 w-4" />Run</Button>
                  </Link>
                  <Link href={`/editor/${group.id}`}>
                    <Button className="mr-4" variant="secondary"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <QuestionGroupsListOptions groupId={group.id} />
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="border-2 border-slate-700 border-dashed rounded-lg hover:border-solid">
            <Link href="/editor">
              <div className="flex items-center justify-center h-full"><Plus className="h-10 w-10" /></div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
