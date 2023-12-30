"use client"

import { QuestionEditorCard } from "@/components/editor/question-editor-card"
import { useQuestionsEditorContext } from "@/components/providers/questions-editor-provider"

export function QuestionEditorList() {

  const questions = useQuestionsEditorContext((s) => s.questions)
  console.log('render list')
  return (
    <>
      {questions.map(q => <QuestionEditorCard key={q.subject} question={q.subject} responses={q.responses} />)}
    </>
  )
}
