"use client"

import { useQuestionsEditorContext } from "@/components/providers/questions-editor-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDebounce } from "@/hooks/utils"
import { QuestionSchema, QuestionType } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"

type QuestionEditorCardProps = {
  keyMap: string,
  indexQuestion: number,
  question: QuestionType
}

export function QuestionEditorCard({
  keyMap,
  indexQuestion,
  question: { id, subject, responses }
}: QuestionEditorCardProps) {

  const [removeQuestion, updateQuestion, addResponse, removeResponse]
    = useQuestionsEditorContext((s) => [s.removeQuestion, s.updateQuestion, s.addResponse, s.removeResponse])

  console.log('render card', keyMap, subject)

  const form = useForm<QuestionType>({
    resolver: zodResolver(QuestionSchema),
    values: { id, subject, responses },
    mode: "onBlur"
  })

  const { getValues, control, formState: { isValid } } = form;

  const { fields: responseFields } = useFieldArray({
    control,
    name: "responses",
  });

  const updateQuestionDebounced = useDebounce(() => {
    if (!isValid) return;

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

  }, 800);

  return (
    <Card className="rounded-lg shadow-md my-7">
      <CardHeader className="p-4">
        <Label htmlFor="title-2" className="text-lg">Question {indexQuestion}</Label>
        <Button variant="link" onClick={() => removeQuestion(keyMap)}>Remove</Button>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form className="space-y-4" onChange={() => updateQuestionDebounced()}>

            {/* Subject */}
            <FormField
              control={control}
              name="subject"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea className="min-h-[100px]" id="description-1" placeholder="Write your next question here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Responses */}
            {responseFields.map((item, index) => (
              <FormField
                key={index}
                control={control}
                name={`responses.${index}.text`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Response {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Your next answer..." {...field} />
                    </FormControl>
                    <FormMessage />
                    <Button variant="ghost" onClick={(e) => { e.preventDefault(); removeResponse(keyMap, index) }} disabled={!isValid || responseFields.length <= 2}>Remove</Button>
                  </FormItem>
                )}
              />
            ))}

            {/* {responseFields.map((item, index) => (
              <div className="space-y-2" key={index}>
                <Label htmlFor="input-1">Input 1</Label>
                <Input placeholder="Your next answer..." {...register(`responses.${index}.text`)} />
                <Button variant="ghost" onClick={(e) => { e.preventDefault(); removeResponse(keyMap, index) }}>Remove</Button>
              </div>
            ))} */}

          </form>
        </Form>

        <Button variant="link" onClick={() => addResponse(keyMap)} disabled={!isValid}>Add</Button>
      </CardContent>
    </Card>
  )
}
