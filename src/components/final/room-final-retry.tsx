'use client'

import { retryRoomAction } from '@/actions/room/retry-room-action'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/useAction'
import { ListRestart } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function RoomFinalRetry({ roomId, shareLink} : { roomId: string, shareLink?: string}) {

  const requestAction = useAction()
  const router = useRouter()

  // BUG!? force refresh
  useEffect(()=> {
    return () => {
      router.refresh()
    }
  }, [router])

  const retryRoom = async () => {
    requestAction(
      () => retryRoomAction({
        roomId,
        shareLink,
      }),
      () => {
        shareLink ?
          redirect(`/room/${roomId}/?shareLink=${shareLink}`) :
          redirect(`/room/${roomId}`)
      }
    )
  }

  return(
    <form action={() => retryRoom()}>
      <Button className="mr-4 sm:w-36">
        <ListRestart className="mr-2" />
        Retry
      </Button>
    </form>
  )
}
