import { useEffect, useRef, useState } from 'react'

export function useAutoSubmit({
  isAutoSubmit,
  questionId,
  choices,
  submitAnswerChoices
}: {
  isAutoSubmit: boolean;
  questionId: string;
  choices: string[];
  submitAnswerChoices: (choices: string[]) => void;
}) {
  const [isAutoTrigger, setAutoTrigger] = useState(false)
  const previousAutoSubmitRef = useRef<{ questionId: string | null}>({ questionId: null })

  useEffect(() => {
    if (!isAutoSubmit) return

    if (choices.length < 1) return

    if (questionId === previousAutoSubmitRef.current.questionId) return

    const time = setTimeout(() => {
      setAutoTrigger(true)
      submitAnswerChoices(choices)
      previousAutoSubmitRef.current = { questionId: questionId }
    }, 650)

    return () => {
      clearTimeout(time)
    }

  }, [submitAnswerChoices, isAutoSubmit, choices, questionId])

  useEffect(() => {
    if (!isAutoSubmit) return

    setAutoTrigger(false)
  }, [questionId, isAutoSubmit])

  return {
    isAutoTrigger,
  }
}

