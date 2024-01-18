import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoxIcon, DollarSignIcon } from "lucide-react";

export const BoardStats = async () => {
  return (
    <section className="py-12">
      <div className="container">
        <h1 className="text-3xl mb-12 text-center font-semibold">Stats</h1>
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
      </div>
    </section>
  )
}
