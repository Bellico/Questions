'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { TextSearch } from 'lucide-react'

import { getRoomListQuery } from '@/actions/queries'
import { retryRoomAction } from '@/actions/room/retry-room-action'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAction } from '@/hooks/useAction'
import { ArrayType } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'

type dataRoomTableType = ArrayType<Awaited<ReturnType<typeof getRoomListQuery>>>

export const columns: (userId: string, onRetry : (roomId: string) => Promise<void>) => ColumnDef<dataRoomTableType>[] = (userId, onRetry) => ([
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => <div>{row.original.user.email}</div>,
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => <div>{row.getValue('score')} %</div>,
  },
  {
    accessorKey: 'successCount',
    header: 'Success',
    cell: ({ row }) => <div>{row.getValue('successCount')} / {row.original.successCount! + row.original.failedCount!}</div>,
  },
  {
    accessorKey: 'dateStart',
    header: 'Start',
    cell: ({ row }) => <div>{row.original.dateStart!.toLocaleString()}</div>,
  },
  {
    accessorKey: 'dateEnd',
    header: 'End',
    cell: ({ row }) => <div>{row.original.dateEnd!.toLocaleString()}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
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
      )
    },
  }
])

export function QuestionGroupDataTable({ userId, data } : { userId : string, data: dataRoomTableType[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const requestAction = useAction()

  async function onRetryAction(roomId: string){
    requestAction(
      () => retryRoomAction({roomId}),
      () => { redirect(`/room/${roomId}`) },
    )
  }

  const table = useReactTable({
    data,
    columns: columns(userId, onRetryAction),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  )
}
