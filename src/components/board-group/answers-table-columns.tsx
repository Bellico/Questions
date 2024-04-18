import { Button } from '@/components/ui/button'
import { ArrayType, secondsToDhms } from '@/lib/utils'
import { getAnwsersBoardQuery } from '@/queries/pages-queries'
import {
  ColumnDef
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

type dataTableType = ArrayType<Awaited<ReturnType<typeof getAnwsersBoardQuery>>>

export const AnswersTableColumns: (
  t : (key: string) => string
) => ColumnDef<dataTableType>[] = (t) =>
  ([
    {
      accessorKey: 'order',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Question
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {row.original.title}
        </div>,
    },
    {
      accessorKey: 'successCount',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('AverageScore')}
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {Math.floor(row.original.successCount * 100  / row.original.totalCount)} % ({row.original.successCount}/{row.original.totalCount})
        </div>,
    },
    {
      accessorKey: 'avgAnwserTime',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('AverageTime')}
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {secondsToDhms(row.getValue('avgAnwserTime'), t)}
        </div>,
    },
  ])
