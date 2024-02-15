import { RoomFinalResumeSection } from '@/components/final/room-final-resume-section'

export function RoomFinalResume() {

  const q = [1, 2, 3, 4, 5]
  return(
    <>
      { q.map(d => <RoomFinalResumeSection key={d} />)}
    </>
  )
}
