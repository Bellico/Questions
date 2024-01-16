import { useState } from "react"

export function useAccordionState(entries: Map<string, unknown>) {

    const [accordionState, setAccordionState] = useState<string[]>([entries.entries().next()?.value[0]])

    const expandAll = () => {
        setAccordionState([...entries.keys()])
    }

    const toggleExpand = (key: string) => {
        if (accordionState.includes(key)) setAccordionState(accordionState.filter(c => c !== key))
        else setAccordionState([...accordionState, key])
    }

    const collapseAll = () => {
        setAccordionState([])
    }

    return [accordionState, toggleExpand, expandAll, collapseAll] as const;
}
