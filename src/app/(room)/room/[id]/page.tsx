import { canPlayRoom, getNextQuestionToAnswer, getProgressInfosRoom } from '@/actions/queries'
import { Room } from '@/components/room/room'
import { auth } from '@/lib/auth'
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

  const progress = await getProgressInfosRoom(room.id, room.groupId!)

  return (
    <Room roomId={room.id} currentQuestion={nextQuestion} progress={progress} />
  )
}
