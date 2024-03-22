import { getRoomBoardQuery } from '@/actions/queries'
import { RoomsChart } from '@/components/groupboard/rooms-chart'
import { RoomsTable } from '@/components/groupboard/rooms-table'
import { RoomMode } from '@prisma/client'

export async function RoomsList({ userId, groupId, mode } : { userId: string, groupId: string, mode: RoomMode}) {
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
        <h2 className="text-2xl font-bold ">{mode} results ({roomsList.length})</h2>
        <p className="text-muted-foreground">Score history (me and sharelink).</p>
        <RoomsTable roomsList={roomsList} userId={userId} />
      </div>
    </>
  )
}
