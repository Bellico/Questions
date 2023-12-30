import { create } from 'zustand'

export type Question = {
    subject: string,
    responses: string[]
}

export type QuestionsEditorProps = {
    name: string,
    questions: Question[],
}

export type QuestionsEditorState = QuestionsEditorProps & {
    add: (question: Question) => void
}

export const createQuestionsEditorStore = (initProps?: Partial<QuestionsEditorProps>) => {
    const DEFAULT_PROPS: QuestionsEditorProps = {
        name: '0',
        questions: []
    }

    return create<QuestionsEditorState>()((set) => ({
        ...DEFAULT_PROPS,
        ...initProps,

        add: (question: Question) => set((state) => ({ questions: [...state.questions, question] })),
    }))
}
