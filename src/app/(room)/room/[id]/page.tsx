import { canPlayRoom, getNextQuestionToAnswer, getProgressInfosRoom, getProgressInfosWithRandom } from '@/actions/queries'
import { Room } from '@/components/room/room'
import { auth } from '@/lib/auth'
import { RoomMode } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function RoomPage({
  params
}: {
params: { id: string, shareLink?: string }
}) {
  const session = await auth()

  const room = await canPlayRoom(params.id, session?.user.id, params.shareLink)
  if(!room){
    redirect('/')
  }

  const nextQuestion = await getNextQuestionToAnswer(room.id)
  if(!nextQuestion){
    redirect('/')
  }

  const isTraining = room.mode === RoomMode.Training
  const progress = room.withRandom ?
    await getProgressInfosWithRandom(room.id, room.groupId!, isTraining):
    await getProgressInfosRoom(room.id, room.groupId!, isTraining)

  return (
    <Room
      roomId={room.id}
      currentQuestion={nextQuestion}
      progress={progress}
      canNavigate={isTraining}
      withProgress={room.withProgress}/>
  )
}
