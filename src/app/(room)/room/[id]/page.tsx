import { Room } from '@/components/room/room'
import { auth } from '@/lib/auth'
import { canPlayRoomQuery, getNextQuestionToAnswerQuery } from '@/queries/commons-queries'
import { getProgressInfosRoomQuery, getProgressInfosWithRandomQuery } from '@/queries/pages-queries'
import { RoomMode } from '@prisma/client'
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

  const isTraining = room.mode === RoomMode.Training
  const progress = room.withRandom ?
    await getProgressInfosWithRandomQuery(room.id, room.groupId!, isTraining):
    await getProgressInfosRoomQuery(room.id, room.groupId!, isTraining)

  return (
    <Room
      roomId={room.id}
      currentQuestion={nextQuestion}
      progress={progress}
      canNavigate={isTraining}
      withProgress={room.withProgress}
      shareLink={searchParams?.shareLink} />
  )
}
