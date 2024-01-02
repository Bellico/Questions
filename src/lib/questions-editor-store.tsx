import { QuestionType } from '@/lib/schema';
import { v4 } from 'uuid';
import { create } from 'zustand';

export type QuestionsEditorProps = {
    id: string,
    name: string,
    questions: Set<QuestionType>,
}

export type QuestionsEditorState = QuestionsEditorProps & {
    addNewQuestion: () => void,
    getArrayQuestions(): QuestionType[],
}

const defaultQuestion: Omit<QuestionType, 'id'> = {
    subject: 'Write here your question',
    responses: [{
        text: 'Write here your first response',
        isCorrect: true
    }]
}

export const createQuestionsEditorStore = (initProps?: Partial<QuestionsEditorProps>) => {
    const DEFAULT_PROPS: QuestionsEditorProps = {
        id: v4(),
        name: 'My Quiz',
        questions: new Set<QuestionType>().add({ id: v4(), ...defaultQuestion })
    }

    return create<QuestionsEditorState>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,

        addNewQuestion: () => set((state) => ({ questions: new Set(state.questions).add({ id: v4(), ...defaultQuestion }) })),

        getArrayQuestions: () => Array.from(get().questions)
    }))
}
