import { QEditorMarkdown } from "@/components/editor/q-editorMarkdown"
import { useQuestionsEditorContext } from "@/components/providers/questions-editor-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useDebounce } from "@/hooks/utils"
import { QuestionFormSchema, QuestionFormType, QuestionType } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { MDXEditorMethods } from "@mdxeditor/editor"
import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useShallow } from "zustand/react/shallow"

type QuestionsEditorSectionProps = {
  keyMap: string,
  indexQuestion: number,
  question: QuestionType
}

export function QuestionsEditorSection({
  keyMap,
  indexQuestion,
  question: { id, title, subject, responses }
}: QuestionsEditorSectionProps) {

  const canAutoAddResponse = useRef<boolean>(false);
  const qEditorMarkdownRef = useRef<MDXEditorMethods>(null);

  const [updateQuestion, updateSubject, removeStoreResponse] = useQuestionsEditorContext(
    useShallow((s) => [s.updateQuestion, s.updateSubject, s.removeResponse]),
  )

  console.log('render card', keyMap)

  const form = useForm<QuestionFormType>({
    resolver: zodResolver(QuestionFormSchema),
    values: { id, subject, responses, title: title || '' },
    mode: "onBlur"
  })

  const { getValues, setValue, control, formState: { isValid } } = form;

  const { fields: responseFields, append, remove } = useFieldArray({
    control,
    name: "responses",
  });

  // EFFECT : Auto add new empty response
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


  // Sync markdown with form
  useEffect(() => {
    if (subject !== '')
      setValue('subject', subject, { shouldValidate: true })
  }, [setValue, subject])

  // Send new state values to store
  const updateQuestionDebounced = useDebounce(() => {
    // if (!isValid) return;
    canAutoAddResponse.current = true
    const newValues = getValues();

    updateQuestion(keyMap, {
      title: newValues.title,
      subject: qEditorMarkdownRef.current?.getMarkdown()!,
      responses: newValues.responses.map(r => ({
        id: r.id,
        isCorrect: r.isCorrect,
        text: r.text
      }))
    })

  }, 800)

  // const qEditorMarkdownChange = useDebounce(() => {
  //   const value = qEditorMarkdownRef.current?.getMarkdown()
  //   if (value) setValue('subject', value, { shouldValidate: true })
  // }, 300)

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
    <section className="py-12 min-h-[calc(100vh-75px)] bg-gray-100 dark:bg-accent">
      <div className="container">

        <Form {...form}>
          <form className="space-y-4" onChange={() => updateQuestionDebounced()}>

            {/* Title (index) */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem >
                  <FormControl>
                    <label className="relative block xl:w-6/12 mx-auto">
                      <FormMessage className="text-center" />
                      <Pencil className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-3" />
                      <Input
                        className="border-0 text-xl sm:text-5xl mb-12 sm:py-7 text-center bg-transparent font-medium hover:ring-1 hover:ring-secondary"
                        placeholder={'Question ' + indexQuestion}
                        type="text"
                        {...field}
                      />
                    </label>
                  </FormControl>
                </FormItem>
              )}
            />

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
                      onChange={updateQuestionDebounced}
                      placeholder="Write your next question here..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Responses */}
            {responseFields.map((item, index) => (
              <div key={index} className="space-y-2 w-full">
                <FormLabel>Response {index + 1}</FormLabel>
                <div className="flex border items-center rounded-xl p-2 has-[.bad]:bg-destructive/5 has-[.good]:bg-success/5">

                  <FormField
                    control={control}
                    name={`responses.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem className={field.value ? 'good' : 'bad'}>
                        <FormControl>
                          <div className="flex items-center space-x-2 mr-2">
                            <Switch id="isCorrect" checked={field.value} onCheckedChange={field.onChange} />
                            <Label htmlFor="isCorrect">{field.value ? 'Good' : 'Bad'}</Label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`responses.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Your next answer..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button variant="ghost" onClick={(e) => { e.preventDefault(); removeResponse(index) }} disabled={responseFields.filter(r => !!r.text).length <= 2}><Trash2 /></Button>
                </div>
              </div>
            ))}

          </form>
        </Form>

        <Button variant="link" onClick={addResponse} disabled={!isValid}>Add</Button>
      </div>
    </section>
  )
}
