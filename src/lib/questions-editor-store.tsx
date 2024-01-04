import { QuestionType } from '@/lib/schema';
import { enableMapSet, produce } from "immer";
import { v4 } from 'uuid';
import { create } from 'zustand';

enableMapSet()

export type QuestionsEditorProps = {
    id: string | null,
    name: string,
    questionsMap: Map<string, QuestionType>,
}

export type QuestionsEditorState = QuestionsEditorProps & {
    addNewQuestion: () => void,
    updateGroupName: (name: string) => void,
    updateQuestion: (id: string, question: QuestionType) => void
}

const defaultQuestion: QuestionType = {
    id: null,
    subject: '',
    responses: [{
        id: null,
        text: '',
        isCorrect: true
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
        name: 'My new questions set',
        questionsMap: createDefaultQuestionsMap()
    }

    return create<QuestionsEditorState>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,

        addNewQuestion: () => set(produce((state: QuestionsEditorState) => {
            state.questionsMap.set(v4(), { ...defaultQuestion })
        })),

        updateGroupName: (name: string) => set((state) => ({ name: name })),

        // updateQuestion: (id: string, question: QuestionType) => set(produce((state: QuestionsEditorState) => {
        //     state.questionsMap.set(id, { ...defaultQuestion })
        // })),

        updateQuestion: (id: string, question: QuestionType) => set((state) => {
            const newMap = new Map(state.questionsMap)

            if (question.responses.every(r => !!r.text)) {
                question.responses.push({
                    id: null,
                    text: '',
                    isCorrect: false
                })
            }

            newMap.set(id, question)
            return { questionsMap: newMap }
        }),
    }))
}
