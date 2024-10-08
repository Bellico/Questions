import {
  ColumnDef
} from '@tanstack/react-table'
import { ArrowUpDown, TextSearch, Trash2 } from 'lucide-react'

import { YesNoDialog } from '@/components/commons/yes-no-dialog'
import { Button } from '@/components/ui/button'
import { ArrayType, diffDateToDhms } from '@/lib/utils'
import { getRoomBoardQuery } from '@/queries/pages-queries'
import Link from 'next/link'

type dataTableType = ArrayType<Awaited<ReturnType<typeof getRoomBoardQuery>>>

export const RoomsTableColumns: (
  userId: string,
  onRetry : (roomId: string) => Promise<void>,
  onDelete : (roomId: string) => Promise<void>,
  t : (key: string) => string
) => ColumnDef<dataTableType>[] = (userId, onRetry, onDelete, t) =>
  ([
    {
      id: 'who',
      accessorKey: 'user.email',
      filterFn: 'equalsString',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('Who')}
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div className="flex items-center gap-2">
          {/* eslint-disable @next/next/no-img-element */}
          <img src={`https://api.dicebear.com/8.x/initials/svg?size=32&seed=${row.original.user.name ?? row.original.user.email}`} alt="avatar"/>
          {row.original.user.name ?? row.original.user.email}
          {row.original.user.id === userId ? ` (${t('Me')})` : row.original.user.name ? ` (${row.original.user.email})`: '' }
        </div>,
    },
    {
      accessorKey: 'score',
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('Score')}
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
      header: t('Success'),
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
          {t('StartDate')}
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
          {t('EndDate')}
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {row.original.dateEnd!.toLocaleString()}
        </div>,
    },
    {
      accessorKey: 'duration',
      sortingFn: 'alphanumeric',
      accessorFn: (row) => row.dateEnd!.getTime() - row.dateStart!.getTime(),
      header: ({ column }) =>
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {t('Duration')}
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ,
      cell: ({ row }) =>
        <div>
          {diffDateToDhms(row.original.dateStart!, row.original.dateEnd!, t)}
        </div>,
    },
    {
      id: 'actions',
      cell: ({ row }) =>
        <div className="space-y-2">
          <Link href={`/results/${row.original.id}`}>
            <Button className='mr-2' variant="outline">
              <TextSearch className="mr-2 size-4" />
              {t('Details')}
            </Button>
          </Link>

          {userId == row.original.user.id && row.original.withRetry !== null && row.original.withRetry > 0 &&
              <Button className='mr-2' variant="destructive" onClick={() => onRetry(row.original.id)}>
                <TextSearch className="mr-2 size-4" />
                {t('Retry')} ({row.original.withRetry})
              </Button>
          }

          <YesNoDialog action={() => onDelete(row.original.id)} titleDialog={t('YesNoTitle')} descDialog={t('YesNoDeleteRoom')}>
            <Button variant="secondary" >
              <Trash2 className="size-4" />
            </Button>
          </YesNoDialog>
        </div>
    }
  ])
