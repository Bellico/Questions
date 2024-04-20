import { Room } from '@/components/room/room'
import { auth } from '@/lib/auth'
import { canPlayRoomQuery, getNextQuestionToAnswerQuery } from '@/queries/commons-queries'
import { getProgressInfosRoomQuery, getProgressInfosWithRandomQuery } from '@/queries/pages-queries'
import { notFound, redirect } from 'next/navigation'

export default async function RoomPage({
  params,
  searchParams
}: {
params: { id: string },
searchParams?: { shareLink?: string }
}) {
  const session = await auth()

  const room = await canPlayRoomQuery(params.id, session?.user.id, searchParams?.shareLink)
  if(!room){
    notFound()
  }

  const nextQuestion = await getNextQuestionToAnswerQuery(room.id)
  if(!nextQuestion){
    redirect('/')
  }

  const progress = room.withRandom ?
    await getProgressInfosWithRandomQuery(room.id, room.groupId!, room.withProgressState):
    await getProgressInfosRoomQuery(room.id, room.groupId!, room.withProgressState)

  return (
    <Room
      roomId={room.id}
      currentQuestion={nextQuestion}
      progress={progress}
      withNavigate={room.withNavigate}
      withProgress={room.withProgress}
      shareLink={searchParams?.shareLink} />
  )
}
