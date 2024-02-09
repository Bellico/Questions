import { answerRoom } from '@/actions/room-actions'
import { useRoomContext } from '@/components/providers/room-provider'
import { RoomQuestionType } from '@/lib/schema'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { useShallow } from 'zustand/react/shallow'

export function useRoomFader() {
  const roomId = useRoomContext(state => state.roomId)
  const currentQuestion = useRoomContext(state => state.currentQuestion)
  const animation = useRoomContext(state => state.animation)
  const isEnd = useRoomContext(state => state.isEnd)

  const [disappears, appearsNewQuestion, showFinal] = useRoomContext(
    useShallow((s) => [s.disappears, s.appearsNewQuestion, s.showFinal]),
  )

  const router = useRouter()
  const nextQRef = useRef<RoomQuestionType | null>(null)
  const [isPending, startTransition] = useTransition()

  // To force refresh if we back and return on the page
  useEffect(()=> {
    return () => {
      router.refresh()
    }
  }, [router])

  // IsEnd so show final
  useEffect(()=> {
    if(!isEnd) return

    const time = setTimeout(() => {
      showFinal()
    }, 750)

    return () => {
      clearTimeout(time)
    }
  }, [showFinal, isEnd])

  // Have next Question so appears it
  useEffect(()=> {
    if(!nextQRef.current) return

    const time = setTimeout(() => {
      appearsNewQuestion(nextQRef.current!)
    }, 750)

    return () => {
      clearTimeout(time)
    }
  }, [appearsNewQuestion, animation])

  // Valide choices and save next question then fadeOut
  async function validAnswerChoices(choices: string[]){
    startTransition(async () => {
      const result = await answerRoom({
        roomId: roomId,
        questionId: currentQuestion.questionId,
        choices
      })

      if(result.data?.next){
        nextQRef.current = result.data.next
        disappears(result.data?.result!, false)
      }
      else{
        nextQRef.current = null
        disappears(result.data?.result!, true)
      }
    })
  }

  return { isPending, animation, validAnswerChoices }
}

