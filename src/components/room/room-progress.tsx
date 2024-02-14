import { useRoomContext } from '@/components/providers/room-provider'
import { cn } from '@/lib/utils'

export function RoomProgress() {
  const progress = useRoomContext(state => state.progress)
  const progressingId = useRoomContext(state => state.progressingId)

  let classDisplayTitle = 'block'
  if(progress.length > 5) classDisplayTitle = 'hidden sm:block'
  if(progress.length > 10) classDisplayTitle = 'hidden lg:block'
  if(progress.length > 15) classDisplayTitle = 'hidden xl:block'
  if(progress.length > 20) classDisplayTitle = 'hidden 2xl:block'
  if(progress.length > 30) classDisplayTitle = 'hidden'

  return(
    <div className="progress-room fixed bottom-0 h-6 w-full animate-fadeIn border-t border-t-gray-200 bg-accent lg:h-8 dark:border-t-black">
      <div className="flex size-full">
        {progress.map(q => (
          <div key={q.title} className="relative flex flex-1 items-center justify-around overflow-hidden text-center">
            <div className={cn('absolute left-0 -z-10 size-full bg-primary/50 dark:bg-primary/25', {
              'animate-room-progress': q.id === progressingId,
              'w-0': !q.isSuccess
            })}></div>
            <div className={classDisplayTitle}>{q.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
