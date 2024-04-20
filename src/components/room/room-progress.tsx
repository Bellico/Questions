import { useRoomContext } from '@/components/providers/room-provider'
import { cn } from '@/lib/utils'
import { CheckCheck, XCircle } from 'lucide-react'

export function RoomProgress() {
  const progress = useRoomContext(state => state.progress)
  const progressingId = useRoomContext(state => state.progressingId)

  let showTitle = 'flex'
  if(progress.length > 5) showTitle = 'hidden sm:flex'
  if(progress.length > 10) showTitle = 'hidden lg:flex'
  if(progress.length > 15) showTitle = 'hidden xl:flex'
  if(progress.length > 20) showTitle = 'hidden 2xl:flex'
  if(progress.length > 30) showTitle = 'hidden'

  const showTitleReverse = progress.length > 5 ? showTitle.replace('hidden', 'flex').replace(':flex',':hidden') : 'hidden'

  function getAnwserResultDisplay(value : boolean | null){
    if(value === null) return null
    return value ?
      <CheckCheck className="ml-2 text-success brightness-50 dark:brightness-200" /> :
      <XCircle className="ml-2 text-destructive brightness-50 dark:brightness-200" />
  }

  return(
    <div className="fixed bottom-0 h-6 w-full animate-fadeIn border-t border-t-gray-200 bg-[#cbc7c7] dark:border-t-black dark:bg-[#1e1e1e] lg:h-8">
      <div className="flex size-full">
        {progress.map((q, i) => (
          <div key={i} className="relative flex flex-1 items-center justify-around overflow-hidden border-r-2 border-accent text-center last:border-none">
            <div className={cn('absolute left-0 -z-10 size-full', {
              'animate-room-progress': q.id === progressingId,
              'w-0': !q.isAnswer,
              'bg-accent': q.hasGood === null,
              'bg-success/50': q.hasGood === true,
              'bg-primary/50': q.hasGood === false
            })}></div>
            <div className={cn(showTitle)}>
              <div>{q.title}</div>
              {q.isAnswer && <div> <span className="animate-fadeIn opacity-0 delay-700">{getAnwserResultDisplay(q.hasGood)}</span></div>}
            </div>
          </div>
        ))}
      </div>

      <div className={cn('absolute inset-0 flex items-center justify-center', showTitleReverse)}>
        <span style={{'textShadow': '#000 1px 0 1px'}} className="px-2">{progress.filter(p => p.isAnswer).length} / {progress.length}</span>
      </div>
    </div>
  )
}
