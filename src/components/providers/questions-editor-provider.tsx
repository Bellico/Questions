import { QuestionsEditorProps, QuestionsEditorState, createQuestionsEditorStore } from "@/lib/questions-editor-store"
import { PropsWithChildren, createContext, useContext, useRef } from "react"
import { useStore } from "zustand"

type QuestionsEditorStore = ReturnType<typeof createQuestionsEditorStore>
export const QuestionsEditorContext = createContext<QuestionsEditorStore | null>(null)

export function useQuestionsEditorContext<T>(selector: (state: QuestionsEditorState) => T): T {
    const store = useContext(QuestionsEditorContext)

    if (!store) throw new Error('Missing BearContext.Provider in the tree')

    return useStore(store, selector)
}

export function QuestionsEditorProvider({ prop, children }: PropsWithChildren<{ prop: QuestionsEditorProps }>) {
    const storeRef = useRef<QuestionsEditorStore>()

    if (!storeRef.current) {
        storeRef.current = createQuestionsEditorStore(prop)
    }

    return (
        <QuestionsEditorContext.Provider value={storeRef.current}>
            {children}
        </QuestionsEditorContext.Provider>
    )
}
