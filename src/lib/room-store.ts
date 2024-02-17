import { RoomQuestionResultType, RoomQuestionType } from '@/lib/schema'
import { create } from 'zustand'

export type RoomStateProps = {
    roomId: string,
    isCompleted: boolean,
    currentQuestion: RoomQuestionType,
    progress : RoomQuestionResultType[]
}

type animationType = 'animate-scaleUp' | 'animate-zoomInRoom' | 'animate-zoomOutRoom'

export type RoomState = RoomStateProps & {
  animation: animationType,
  progressingId?: string
  isEnd: boolean
  showFinal: () => void,
  disappears: (result : RoomQuestionResultType, isEnd: boolean) => void,
  appearsNewQuestion: (question: RoomQuestionType) => void,
}

export const createRoomStore = (initProps: RoomStateProps) => {
  const DEFAULT_PROPS = {
    animation: 'animate-scaleUp' as animationType,
    isEnd: false
  }

  return create<RoomState>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,

    showFinal: () => set(() => ({ isCompleted : true })),

    disappears: (result : RoomQuestionResultType, isEnd: boolean) => set((state) => {
      const newProgress = [...state.progress]
      const index = newProgress.findIndex(p => p.id == result.id)
      if(index >= 0){
        newProgress[index].hasGood = result.hasGood
        newProgress[index].title = result.title
        newProgress[index].isAnswer = result.isAnswer
      }
      else{
        const replace = newProgress.findIndex(p => !p.id)
        newProgress[replace].id = result.id
        newProgress[replace].hasGood = result.hasGood
        newProgress[replace].title = result.title
        newProgress[replace].isAnswer = result.isAnswer
      }

      return { animation : 'animate-zoomOutRoom', progress: newProgress, progressingId: result.id!, isEnd }
    }),

    appearsNewQuestion: (question: RoomQuestionType) => set(() => ({ currentQuestion: question, animation : 'animate-zoomInRoom' })),
  }))
}
