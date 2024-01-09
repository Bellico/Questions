import { QuestionType } from '@/lib/schema';
import { randomSwName } from '@/lib/utils';
import { v4 } from 'uuid';
import { create } from 'zustand';

export type QuestionsEditorProps = {
    id: string | null,
    name: string,
    questionsMap: Map<string, QuestionType>,
}

export type QuestionsEditorState = QuestionsEditorProps & {
    updateGroupName: (name: string) => void,
    addQuestion: () => void,
    removeQuestion: (keyMap: string) => void,
    updateQuestion: (keyMap: string, question: QuestionType) => void,
    addResponse: (keyMap: string) => void,
    removeResponse: (keyMap: string, index: number) => void,
}

const defaultQuestion: QuestionType = {
    id: null,
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
        [v4(), { ...defaultQuestion }],
    ])
}

export const createQuestionsEditorStore = (initProps?: Partial<QuestionsEditorProps>) => {
    const DEFAULT_PROPS: QuestionsEditorProps = {
        id: null,
        name: randomSwName() + '\'s questions',
        questionsMap: createDefaultQuestionsMap()
    }

    return create<QuestionsEditorState>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,

        updateGroupName: (name: string) => set((state) => ({ name: name })),

        // addQuestion: () => set(produce((state: QuestionsEditorState) => {
        //     state.questionsMap.set(v4(), { ...defaultQuestion })
        // })),

        addQuestion: () => set((state) => {
            const newMap = new Map(state.questionsMap)
            newMap.set(v4(), { ...defaultQuestion })
            return { questionsMap: newMap }
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

            // if (question.responses.every(r => !!r.text)) {
            //     question.responses.push({
            //         id: null,
            //         text: '',
            //         isCorrect: false
            //     })
            // }

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
    }))
}
