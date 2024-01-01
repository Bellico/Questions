import { QuestionsTable } from "@/components/board/questions-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { BoxIcon, DollarSignIcon, Mail } from "lucide-react";
import Link from "next/link";

const getQuestionGroupQuery = (userId?: string) =>
  prisma.questionGroup.findMany({
    orderBy: {
      creationDate: 'desc',
    }
  });

export default async function BoardPage() {
  const questionGroups = await getQuestionGroupQuery();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <BoxIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+10.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSignIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10,000</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSignIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10,000</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSignIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10,000</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+20% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Link href="/editor">
          <Button><Mail className="mr-2 h-4 w-4" />Create</Button>
        </Link>
      </div>

      <QuestionsTable questionGroups={questionGroups} />
    </>
  )
}
