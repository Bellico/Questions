import { getRoomFinalResume } from '@/actions/queries'
import { RoomFinalResumeSection } from '@/components/final/room-final-resume-section'

export async function RoomFinalResume({roomId} : { roomId: string}) {
  const resume = await getRoomFinalResume(roomId)
  return(
    <>
      { resume.map(answer => <RoomFinalResumeSection key={answer.id} answerResume={answer} />)}
    </>
  )
}
