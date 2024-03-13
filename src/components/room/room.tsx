'use client'

import { RoomProvider } from '@/components/providers/room-provider'
import { RoomDisplay } from '@/components/room/room-display'
import { RoomProgressType, RoomQuestionNextType } from '@/lib/schema'

type RoomProps = {
  roomId: string
  currentQuestion: RoomQuestionNextType
  progress: RoomProgressType[]
  withProgress: boolean
  canNavigate: boolean
  shareLink?: string
}

export function Room(props: RoomProps) {
  return (
    <RoomProvider value={{...props}}>
      <RoomDisplay
        roomId={props.roomId}
        canNavigate={props.canNavigate}
        withProgress={props.withProgress}
        shareLink={props.shareLink} />
    </RoomProvider>
  )
}


