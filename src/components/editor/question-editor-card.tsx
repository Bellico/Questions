"use client"

import { QEditorMarkdown } from "@/components/editor/q-editorMarkdown"
import { useQuestionsEditorContext } from "@/components/providers/questions-editor-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/utils"
import { QuestionSchema, QuestionType } from "@/lib/schema"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { useEffect, useRef } from "react"
import { useFieldArray, useForm } from "react-hook-form"

type QuestionEditorCardProps = {
  keyMap: string,
  indexQuestion: number,
  question: QuestionType
}

export function QuestionEditorCard({
  keyMap,
  question: { id, subject, responses }
}: QuestionEditorCardProps) {

  const canAutoAddResponse = useRef<boolean>(false);
  const qEditorMarkdownRef = useRef<MDXEditorMethods>(null);

  const [updateQuestion, updateSubject, removeStoreResponse]
    = useQuestionsEditorContext((s) => [s.updateQuestion, s.updateSubject, s.removeResponse])

  console.log('render card', keyMap)

  const form = useForm<QuestionType>({
    resolver: zodResolver(QuestionSchema),
    values: { id, subject, responses },
    mode: "onBlur"
  })

  const { getValues, setValue, control, formState: { isValid } } = form;
  const subjectFormValue = getValues('subject')

  const { fields: responseFields, append, remove } = useFieldArray({
    control,
    name: "responses",
  });

  // Auto add new empty response
  useEffect(() => {
    if (!isValid) return;
    if (!canAutoAddResponse.current) return;

    if (responseFields.every(r => !!r.text)) {
      append({
        id: null,
        text: '',
        isCorrect: false
      }, {
        shouldFocus: false,
      })
    }
  }, [append, responseFields, isValid])

  useEffect(() => {
    if (!isValid) return;
    updateSubject(keyMap, subjectFormValue)
  }, [updateSubject, isValid, keyMap, subjectFormValue])

  // Send new values to store
  const updateQuestionDebounced = useDebounce(() => {
    if (!isValid) return;

    canAutoAddResponse.current = true
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

  const qEditorMarkdownChange = useDebounce(() => {
    const value = qEditorMarkdownRef.current?.getMarkdown()
    if (value) setValue('subject', value, { shouldValidate: true })
  }, 300);

  function addResponse() {
    append({
      id: null,
      text: '',
      isCorrect: false
    }, {
      shouldFocus: true,
    })
  }

  function removeResponse(index: number) {
    canAutoAddResponse.current = false

    const newValues = getValues();
    if (newValues.responses[index].text !== '') {
      removeStoreResponse(keyMap, index)
    } else {
      remove(index)
    }
  }

  return (
    <Card className={cn("rounded-lg shadow-md my-7", { "border-red-400": !isValid })}>
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
                    {/* <Textarea className="min-h-[100px]" placeholder="Write your next question here..." {...field} /> */}
                    <QEditorMarkdown className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                      markdown={subject}
                      editorRef={qEditorMarkdownRef}
                      onChange={qEditorMarkdownChange}
                      placeholder="Write your next question here..." />
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
                    <Button variant="ghost" onClick={(e) => { e.preventDefault(); removeResponse(index) }} disabled={responseFields.filter(r => !!r.text).length <= 2}>Remove</Button>
                  </FormItem>
                )}
              />
            ))}

          </form>
        </Form>

        <Button variant="link" onClick={addResponse} disabled={!isValid}>Add</Button>
      </CardContent>
    </Card>
  )
}
