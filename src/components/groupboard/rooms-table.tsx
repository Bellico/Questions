'use client'

import { retryRoomAction } from '@/actions/room/retry-room-action'
import { DataTable } from '@/components/commons/data-table'
import { RoomsTableColumns } from '@/components/groupboard/rooms-table-columns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAction } from '@/hooks/useAction'
import { useDataTable } from '@/hooks/useDataTable'
import { ArrayType } from '@/lib/utils'
import { getRoomBoardQuery } from '@/queries/pages-queries'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type dataTableType = ArrayType<Awaited<ReturnType<typeof getRoomBoardQuery>>>

export function RoomsTable({ userId, roomsList } : { userId: string, roomsList: dataTableType[]} ) {

  const { t } = useTranslation('global')

  const columns = RoomsTableColumns(userId, onRetryAction, t)
  const table = useDataTable(roomsList, columns)
  const userSelect = [...new Set(roomsList.map(r => r.user.email!))].sort()

  const requestAction = useAction()

  // Query list sort by dateStart asc for chart => make a sort desc for table
  useEffect(() => {
    const dateColumn = table.getColumn('dateStart')
    dateColumn?.toggleSorting(true)
  },[table])

  async function onRetryAction(roomId: string){
    requestAction(
      () => retryRoomAction({roomId}),
      () => { redirect(`/room/${roomId}`) },
    )
  }

  return (
    <div className="space-y-4">

      {userSelect.length > 1 &&
        <Select
          value={(table.getColumn('who')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) => {
            table.getColumn('who')?.setFilterValue(value == 'all' ? '' : value)
          }}
        >
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder={t('FilterUsers')} />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectItem value='all'>{t('AllUsers')}</SelectItem>
            {userSelect.map((user) => (
              <SelectItem key={user} value={user}>{user}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      }

      <DataTable table={table} />
    </div>
  )
}
