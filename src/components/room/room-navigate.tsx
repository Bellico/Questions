import { useRoomContext } from '@/components/providers/room-provider'
import { Button } from '@/components/ui/button'
import { ArrowBigLeftDash, ArrowBigRightDash } from 'lucide-react'
import { FormEvent } from 'react'
import { useShallow } from 'zustand/react/shallow'

type RoomNavigateProps = {
  navigate: (questionId: string) => Promise<void>
}

export function RoomNavigate({navigate} : RoomNavigateProps) {
  const canGoPrev = useRoomContext(state => state.canGoPrev)
  const canGoNext = useRoomContext(state => state.canGoNext)

  const [goToPrevQuestion, goToNextQuestion] = useRoomContext(
    useShallow((s) => [s.getPrevQuestionId, s.getNextQuestionId]),
  )

  async function navigateToPrev(e: FormEvent){
    e.preventDefault()
    await navigate(goToPrevQuestion())
  }

  async function navigateToNext(e: FormEvent){
    e.preventDefault()
    await navigate(goToNextQuestion())
  }

  return (
    <div className="inset-x-0 z-10 mb-6 flex justify-between sm:absolute">
      <form onSubmit={navigateToPrev}>
        <Button variant="outline" type="submit" disabled={!canGoPrev} >
          <ArrowBigLeftDash className="mr-2" /> Prev
        </Button>
      </form>
      <form onSubmit={navigateToNext}>
        <Button variant="outline" type="submit" disabled={!canGoNext} >
          Next <ArrowBigRightDash className="ml-2" />
        </Button>
      </form>
    </div>
  )
}


