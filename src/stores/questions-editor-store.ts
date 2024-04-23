import { QuestionType } from '@/lib/schema'
import { arrayToMap, findIndexOfKeyMap, mapToArray } from '@/lib/utils'
import { arrayMove } from '@dnd-kit/sortable'
import superjson from 'superjson'
import { create } from 'zustand'
import { PersistStorage, persist } from 'zustand/middleware'

export type QuestionsEditorStateProps = {
    id: string | null,
    name: string,
    questionsMap: Map<string, QuestionType>,
}

export type QuestionsEditorState = QuestionsEditorStateProps & {
    lastQuestionAdded?: string,
    updateGroupName: (name: string) => void,
    addQuestion: () => void,
    removeQuestion: (keyMap: string) => void,
    updateQuestion: (keyMap: string, question: Omit<QuestionType, 'id' | 'order'>) => void,
    updateSubject: (keyMap: string, subject: string) => void,
    addResponse: (keyMap: string) => void,
    removeResponse: (keyMap: string, index: number) => void,
    changeOrder: (keyMapActive: string, keyMapOver: string) => void,
}

const defaultQuestion: QuestionType = {
  id: null,
  order: 1,
  subject: '',
  title: null,
  responses: [{
    id: null,
    text: '',
    isCorrect: false
  },
  {
    id: null,
    text: '',
    isCorrect: false
  }]
}

function createDefaultQuestionsMap(): Map<string, QuestionType> {
  return new Map([
    [crypto.randomUUID(), { ...defaultQuestion }],
  ])
}

const storage: PersistStorage<QuestionsEditorState> = {
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    return superjson.parse(str)
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value))
  },
  removeItem: (name) => localStorage.removeItem(name),
}

export const createQuestionsEditorStore = (initProps?: Partial<QuestionsEditorStateProps>) => {
  const DEFAULT_PROPS: QuestionsEditorStateProps = {
    id: null,
    name: '',
    questionsMap: createDefaultQuestionsMap()
    // questionsMap: generateRandomGroup()
  }

  return create<QuestionsEditorState>()(persist((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,

    updateGroupName: (name: string) => set((state) => ({ name: name })),

    addQuestion: () => set((state) => {
      const newMap = new Map(state.questionsMap)
      const newKey = crypto.randomUUID()
      const maxOrder = [...state.questionsMap].map(([_, value]) => value.order).reduce((a, b) => Math.max(a, b))
      newMap.set(newKey, { ...defaultQuestion, order: maxOrder + 1 })
      return { questionsMap: newMap, lastQuestionAdded: newKey }
    }),

    removeQuestion: (keyMap: string) => set((state) => {
      const newMap = new Map(state.questionsMap)
      newMap.delete(keyMap)!
      return { questionsMap: newMap }
    }),

    updateQuestion: (keyMap: string, newValues: Omit<QuestionType, 'id' | 'order'>) => set((state) => {
      const newMap = new Map(state.questionsMap)
      const question = newMap.get(keyMap)!
      question.subject = newValues.subject
      question.responses = newValues.responses
      question.title = newValues.title

      newMap.set(keyMap, question)
      return { questionsMap: newMap }
    }),

    updateSubject: (keyMap: string, subject: string) => set((state) => {
      const newMap = new Map(state.questionsMap)
      const question = newMap.get(keyMap)!
      question.subject = subject

      newMap.set(keyMap, question)
      return { questionsMap: newMap }
    }),

    addResponse: (keyMap: string) => set((state) => {
      const newMap = new Map(state.questionsMap)
      const question = newMap.get(keyMap)!
      question.responses = [...question.responses, {
        id: null,
        text: '',
        isCorrect: false
      }]

      newMap.set(keyMap, question)
      return { questionsMap: newMap }
    }),

    removeResponse: (keyMap: string, index: number) => set((state) => {
      const newMap = new Map(state.questionsMap)
      const question = newMap.get(keyMap)!
      question.responses = [...question.responses.filter((r, i) => i !== index)]
      newMap.set(keyMap, question)
      return { questionsMap: newMap }
    }),

    changeOrder: (keyMapActive: string, keyMapOver: string) => set((state) => {
      const oldIndex = findIndexOfKeyMap(state.questionsMap, keyMapActive)
      const newIndex =  findIndexOfKeyMap(state.questionsMap, keyMapOver)
      let questionArray = mapToArray(state.questionsMap)
      questionArray = arrayMove(questionArray, oldIndex, newIndex)

      let order = 1
      questionArray.forEach(q => q.order = order++)

      return { questionsMap: arrayToMap(questionArray) }
    })

  }), {
    name: (initProps?.id ?? '00') + '-q-draft-editor',
    storage,
    skipHydration: true,
  }))
}
