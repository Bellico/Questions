import { RoomsChart } from '@/components/board-group/rooms-chart'
import { RoomsTable } from '@/components/board-group/rooms-table'
import { getRoomBoardQuery } from '@/queries/pages-queries'
import { translate } from '@/queries/utils-queries'
import { RoomMode } from '@prisma/client'

export async function RoomsList({ userId, groupId, mode } : { userId: string, groupId: string, mode: RoomMode}) {
  const { t } = await translate('global')
  const roomsList = await getRoomBoardQuery(groupId, mode)

  const chartDatas = roomsList
    .slice(0, 10)
    .filter(row => row.user.id === userId)
    .map(row => ({
      score: row.score!
    }))

  return (
    <>
      <aside className="py-6 lg:py-12">
        <RoomsChart data={chartDatas} />
      </aside>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold "> {t('RatingResults')} ({roomsList.length})</h2>
        <p className="text-muted-foreground"> {t('RatingResultsDesc')}</p>
        <RoomsTable roomsList={roomsList} userId={userId} />
      </div>
    </>
  )
}
