import { QuestionsEditorProps, QuestionsEditorState, createQuestionsEditorStore } from "@/lib/questions-editor-store"
import { PropsWithChildren, createContext, useContext, useRef } from "react"
import { useStore } from "zustand"

type QuestionsEditorStore = ReturnType<typeof createQuestionsEditorStore>

const QuestionsEditorContext = createContext<QuestionsEditorStore | null>(null)

export function useQuestionsEditorContext<T>(selector: (state: QuestionsEditorState) => T): T {
    const store = useContext(QuestionsEditorContext)

    if (!store) throw new Error('Missing Provider in the tree')

    return useStore(store, selector)
}

export function QuestionsEditorProvider({ value, children }: PropsWithChildren<{ value?: QuestionsEditorProps }>) {
    const storeRef = useRef<QuestionsEditorStore>()

    if (!storeRef.current) {
        storeRef.current = createQuestionsEditorStore(value)
    }

    return (
        <QuestionsEditorContext.Provider value={storeRef.current}>
            {children}
        </QuestionsEditorContext.Provider>
    )
}
