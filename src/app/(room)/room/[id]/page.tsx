import { canPlayRoom, getNextQuestionToAnswer } from '@/actions/queries'
import { RoomDisplayVertical } from '@/components/room/room-display'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function RoomPage({
  params
}: {
params: { id: string, shareLink?: string }
}) {
  const session = await auth()

  const room = await canPlayRoom(params.id, session?.user.id!, params.shareLink)
  if(!room){
    redirect('/')
  }

  const nextQuestion = await getNextQuestionToAnswer(room.id)!
  if(!nextQuestion){
    redirect(`/results/${room.id}`)
  }

  return (
    room.display === 'Vertical' ?
      <RoomDisplayVertical roomId={room.id} currentQuestion={nextQuestion} /> :
      null
  )
}
