import { QuestionType } from '@/lib/schema';
import { randomSwName } from '@/lib/utils';
import superjson from 'superjson'; //  can use anything: serialize-javascript, devalue, etc.
import { v4 } from 'uuid';
import { create } from 'zustand';
import { PersistStorage, persist } from 'zustand/middleware';

export type QuestionsEditorProps = {
    id: string | null,
    name: string,
    questionsMap: Map<string, QuestionType>,
}

export type QuestionsEditorState = QuestionsEditorProps & {
    lastQuestionAdded?: string,
    updateGroupName: (name: string) => void,
    addQuestion: () => void,
    removeQuestion: (keyMap: string) => void,
    updateQuestion: (keyMap: string, question: QuestionType) => void,
    updateSubject: (keyMap: string, subject: string) => void,
    addResponse: (keyMap: string) => void,
    removeResponse: (keyMap: string, index: number) => void,
}

const defaultQuestion: QuestionType = {
    id: null,
    order: 1,
    subject: '',
    responses: [{
        id: null,
        text: '',
        isCorrect: true
    },
    {
        id: null,
        text: '',
        isCorrect: false
    }]
}

function createDefaultQuestionsMap(): Map<string, QuestionType> {
    return new Map([
        [v4(), { ...defaultQuestion }],
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

export const createQuestionsEditorStore = (initProps?: Partial<QuestionsEditorProps>) => {
    const DEFAULT_PROPS: QuestionsEditorProps = {
        id: null,
        name: '',
        questionsMap: createDefaultQuestionsMap()
    }

    return create<QuestionsEditorState>()(persist((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,

        updateGroupName: (name: string) => set((state) => ({ name: name })),

        // addQuestion: () => set(produce((state: QuestionsEditorState) => {
        //     state.questionsMap.set(v4(), { ...defaultQuestion })
        // })),

        addQuestion: () => set((state) => {
            const newMap = new Map(state.questionsMap)
            const newKey = v4()
            const maxOrder = [...state.questionsMap].map(([_, value]) => value.order).reduce((a, b) => Math.max(a, b))
            newMap.set(newKey, { ...defaultQuestion, order: maxOrder + 1 })
            return { questionsMap: newMap, lastQuestionAdded: newKey }
        }),

        removeQuestion: (keyMap: string) => set((state) => {
            const newMap = new Map(state.questionsMap)
            newMap.delete(keyMap)!
            return { questionsMap: newMap }
        }),

        // updateQuestion: (id: string, question: QuestionType) => set(produce((state: QuestionsEditorState) => {
        //     state.questionsMap.set(id, { ...defaultQuestion })
        // })),

        updateQuestion: (keyMap: string, question: QuestionType) => set((state) => {
            const newMap = new Map(state.questionsMap)

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
    }), {
        name: 'q-editor',
        storage,
        skipHydration: true,
    }))
}
