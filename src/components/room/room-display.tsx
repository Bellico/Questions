import { Spinner } from '@/components/commons/spinner'
import { useRoomContext } from '@/components/providers/room-provider'
import { RoomCompleted } from '@/components/room/room-completed'
import { RoomProgress } from '@/components/room/room-progress'
import { RoomResponses } from '@/components/room/room-responses'
import { RoomSubject } from '@/components/room/room-subject'
import { useRoomFader } from '@/hooks/useRoomFader'

export function RoomDisplay() {

  const isCompleted = useRoomContext(state => state.isCompleted)
  const { isPending, animation, validAnswerChoices} = useRoomFader()

  if(isCompleted){
    return <RoomCompleted />
  }

  return (
    <section className="relative min-h-[calc(100vh-65px)] w-full lg:py-24">
      <div className="container mb-12">

        <div className={animation}>
          <RoomSubject />
          <RoomResponses submitAnswerChoices={validAnswerChoices} />
          {isPending && <Spinner className="mt-8" />}
        </div>

      </div>
      <RoomProgress />
    </section>
  )
}


