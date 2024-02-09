'use client'

import { RoomProvider } from '@/components/providers/room-provider'
import { RoomDisplay } from '@/components/room/room-display'
import { RoomQuestionResultType, RoomQuestionType } from '@/lib/schema'

type RoomProps = {
  roomId: string
  currentQuestion: RoomQuestionType
  progress: RoomQuestionResultType[]
}

export function Room(props: RoomProps) {
  return (
    <RoomProvider value={{...props, isCompleted: false}}>
      <RoomDisplay />
    </RoomProvider>
  )
}


