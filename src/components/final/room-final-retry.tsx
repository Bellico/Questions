import { retryRoomAction } from '@/actions/room/retry-room-action'
import { Button } from '@/components/ui/button'
import { ListRestart } from 'lucide-react'
import { redirect } from 'next/navigation'

export function RoomFinalRetry({ roomId, shareLink} : { roomId: string, shareLink?: string}) {

  const retryRoom = async () => {
    'use server'
    const result = await retryRoomAction({
      roomId,
      shareLink,
    })

    if(result.success){
      shareLink ?
        redirect(`/room/${roomId}/?shareLink=${shareLink}`) :
        redirect(`/room/${roomId}`)
    }
  }

  return(
    <form action={retryRoom}>
      <Button className="mr-4 sm:w-36">
        <ListRestart className="mr-2" />
        Retry
      </Button>
    </form>
  )
}
