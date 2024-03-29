import {
  ColumnDef
} from '@tanstack/react-table'
import { ArrowUpDown, TextSearch } from 'lucide-react'

import { getRoomBoardQuery } from '@/actions/queries'
import { Button } from '@/components/ui/button'
import { ArrayType } from '@/lib/utils'
import Link from 'next/link'

type dataTableType = ArrayType<Awaited<ReturnType<typeof getRoomBoardQuery>>>

export const RoomsTableColumns: (
  userId: string,
  onRetry : (roomId: string) => Promise<void>
) => ColumnDef<dataTableType>[] = (userId, onRetry) =>
  ([
    {
      id: 'who',
      accessorKey: 'user.email',
      filterFn: 'equalsString',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Who
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div className="flex items-center gap-2">
          {/* eslint-disable @next/next/no-img-element */}
          <img src={`https://api.dicebear.com/8.x/initials/svg?size=32&seed=${row.original.user.email}`} alt="avatar"/>
          {row.original.user.email} {row.original.user.id === userId && '(me)'}
        </div>,
    },
    {
      accessorKey: 'score',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Score
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {row.getValue('score')} %
        </div>,
    },
    {
      accessorKey: 'successCount',
      header: 'Success',
      cell: ({ row }) =>
        <div>
          {row.getValue('successCount')} / {row.original.successCount! + row.original.failedCount!}
        </div>,
    },
    {
      id: 'dateStart',
      accessorKey: 'dateStart',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Start
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {row.original.dateStart!.toLocaleString()}
        </div>,
    },
    {
      accessorKey: 'dateEnd',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          End
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {row.original.dateEnd!.toLocaleString()}
        </div>,
    },
    {
      id: 'actions',
      cell: ({ row }) =>
        <div className="space-x-2">
          <Link href={`/results/${row.original.id}`}>
            <Button variant="outline">
              <TextSearch className="mr-2 size-4" />
              Details
            </Button>
          </Link>

          {userId == row.original.user.id && row.original.withRetry !== null && row.original.withRetry > 0 &&
              <Button variant="destructive" onClick={() => onRetry(row.original.id)}>
                <TextSearch className="mr-2 size-4" />
                  Retry ({row.original.withRetry})
              </Button>
          }
        </div>
    }
  ])
