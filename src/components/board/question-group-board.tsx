import { getRoomListQuery } from '@/actions/queries'
import { QuestionGroupDataTable } from '@/components/board/question-group-data-table'

export async function QuestionGroupBoard({userId, groupId} : { userId: string, groupId: string}) {
  const roomsList = await getRoomListQuery(groupId)

  return <QuestionGroupDataTable userId={userId} data={roomsList} />
}
