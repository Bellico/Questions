import { useEffect, useState } from 'react'

export function useAccordion(entries: Map<string, unknown>, lastAddedKey?: string) {

  const defaultValue = entries.size == 1 ? [entries.entries().next()?.value[0]] : []
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
