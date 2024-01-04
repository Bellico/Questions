"use client"

import { useQuestionsEditorContext } from "@/components/providers/questions-editor-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDebounce } from "@/hooks/utils"
import { QuestionSchema, QuestionType } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"

type QuestionEditorCardProps = {
  keyMap: string,
  question: QuestionType
}

export function QuestionEditorCard({ keyMap, question: { id, subject, responses } }: QuestionEditorCardProps) {

  const updateQuestion = useQuestionsEditorContext((s) => s.updateQuestion)

  console.log('render card', keyMap, subject)

  const form = useForm<QuestionType>({
    resolver: zodResolver(QuestionSchema),
    values: { id, subject, responses }
  })

  const { register, getValues, control } = form;

  const { fields: responseFields } = useFieldArray({
    control,
    name: "responses",
  });

  const updateQuestionDebounced = useDebounce(() => {
    const newValues = getValues();

    updateQuestion(keyMap, {
      id: newValues.id,
      subject: newValues.subject,
      responses: newValues.responses.map(r => ({
        id: r.id,
        isCorrect: r.isCorrect,
        text: r.text
      }))
    })

  }, 300);

  return (
    <Card className="rounded-lg shadow-md my-7">
      <CardHeader className="p-4">
        <Label htmlFor="title-2" className="text-lg">Question 1</Label>
      </CardHeader>
      <CardContent className="p-4">
        <form className="space-y-4" onChange={() => updateQuestionDebounced()}>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description-1">Description</Label>
            <Textarea className="min-h-[100px]" id="description-1" placeholder="Write your next question here..." {...register('subject')} />
          </div>
          {responseFields.map((item, index) => (
            <div className="space-y-2" key={index}>
              <Label htmlFor="input-1">Input 1</Label>
              <Input placeholder="Your next answer..." {...register(`responses.${index}.text`)} />
            </div>
          ))}
        </form>
      </CardContent>
    </Card>
  )
}
