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

  function getAnwserResultDisplay(value : boolean | null){
    if(value === null) return ''
    return value ? 'OK' : 'KO'
  }

  return(
    <div className="progress-room fixed bottom-0 h-6 w-full animate-fadeIn border-t border-t-gray-200 bg-accent lg:h-8 dark:border-t-black">
      <div className="flex size-full">
        {progress.map(q => (
          <div key={q.id} className="relative flex flex-1 items-center justify-around overflow-hidden border-r-2 border-accent text-center last:border-none">
            <div className={cn('absolute left-0 -z-10 size-full bg-primary/25 dark:bg-primary/10', {
              'animate-room-progress': q.id === progressingId,
              'w-0': !q.isAnswer
            })}></div>
            <div className={cn('relative',classDisplayTitle)}>
              {q.title}
              {q.isAnswer && <span className=" absolute animate-fadeIn opacity-0 delay-700">{getAnwserResultDisplay(q.hasGood)}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
