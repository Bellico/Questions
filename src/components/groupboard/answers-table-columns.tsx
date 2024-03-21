'use client'

import {
  ColumnDef
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { getAnwsersBoardQuery } from '@/actions/queries'
import { Button } from '@/components/ui/button'
import { ArrayType, secondsToDhms } from '@/lib/utils'

type dataTableType = ArrayType<Awaited<ReturnType<typeof getAnwsersBoardQuery>>>

export const AnswersTableColumns: ColumnDef<dataTableType>[] =
  [
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
          Question {row.original.order} {row.original.title ? `(${row.original.title})` : ''}
        </div>,
    },
    {
      accessorKey: 'successCount',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Average Score
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
          Average Response Time
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {secondsToDhms(row.getValue('avgAnwserTime'))}
        </div>,
    },
  ]
