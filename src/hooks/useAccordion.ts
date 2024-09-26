import { useEffect, useState } from 'react'

export function useAccordion<T>(entries: Map<string, T>, lastAddedKey?: string) {

  const defaultValue = entries.size == 1 ? [entries.keys().next().value as string] : []
  const [accordionState, setAccordionState] = useState<string[]>(defaultValue)

  useEffect(() => {
    if (lastAddedKey) {
      setAccordionState([lastAddedKey])
    }
  }, [lastAddedKey])

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

  return [accordionState, toggleExpand, expandAll, collapseAll] as const
}
