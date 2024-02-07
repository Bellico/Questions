'use client'

import { answerRoom } from '@/actions/room-actions'
import { Spinner } from '@/components/commons/spinner'
import { RoomCompleted } from '@/components/room/room-completed'
import { RoomProgress } from '@/components/room/room-progress'
import { RoomResponses } from '@/components/room/room-responses'
import { RoomSubject } from '@/components/room/room-subject'
import { AnswerRoomReturnType } from '@/lib/schema'
import { useEffect, useRef, useState, useTransition } from 'react'

type RoomDisPlayProps = {
  roomId: string
  currentQuestion: AnswerRoomReturnType
}

export function RoomDisplayVertical({roomId, currentQuestion}: RoomDisPlayProps) {

  const valueState = { ...currentQuestion, animation : 'animate-scaleUp'}
  const [state, setState] = useState(valueState)
  const [isCompleted, setIsCompleted] = useState(false)
  const nextQRef = useRef<AnswerRoomReturnType | null>(null)
  const [isPending, startTransition] = useTransition()
  const animation = state.animation

  useEffect(()=> {
    if(!nextQRef.current) return

    const time = setTimeout(() => {
      setState({...nextQRef.current!, animation: 'animate-zoomInRoom'})
      nextQRef.current = null
    }, 700)

    return () => {
      clearTimeout(time)
    }
  }, [animation])

  async function onValidAnswerChoices(choices: string[]){
    startTransition(async () => {
      const result = await answerRoom({
        roomId: roomId,
        questionId: state.questionId,
        choices
      })

      if(result.data){
        nextQRef.current = result.data
        setState(s => ({...s, animation: 'animate-zoomOutRoom'}))
      }
      else{
        nextQRef.current = null
        setIsCompleted(true)
      }
    })
  }

  if(isCompleted){
    return (
      <RoomCompleted />
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full py-12 lg:py-24">
      <div className="container">

        <div className={state.animation}>
          <section>
            <RoomSubject title={state.title} subject={state.subject} order={state.order} />
          </section>
          <section>
            <RoomResponses responses={state.responses} submitAnswerChoices={onValidAnswerChoices} />
          </section>
          {isPending && <Spinner />}
        </div>

      </div>
      <RoomProgress />
    </div>
  )
}


