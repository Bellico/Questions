"use client"

import { useQuestionsEditorContext } from "@/components/providers/questions-editor-provider"
import { Button } from "@/components/ui/button"

export function AddQuestionButton() {

  const add = useQuestionsEditorContext((s) => s.add)

  console.log('render button')

  return (
    <Button onClick={() => add({
      subject: "new",
      responses: []
    })} className="w-full">Add</Button>
  )
}
