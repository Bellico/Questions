import { useRoomContext } from '@/components/providers/room-provider'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const RoomResponsesSchema = z.object({
  responses: z.array(z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean().nullish(),
  })).refine((value) => {
    return value.filter((item) => item.isCorrect).length >= 1
  }),
})

type RoomResponsesType = z.infer<typeof RoomResponsesSchema>

type RoomResponsesProps = {
  submitAnswerChoices: (choices: string[]) => void
}

export function RoomResponses({submitAnswerChoices }: RoomResponsesProps) {
  const { t } = useTranslation('global')
  const currentQuestion = useRoomContext(state => state.currentQuestion)
  const responses = currentQuestion.responses.map(r => ({...r, isCorrect : false}))

  const form = useForm<RoomResponsesType>({
    resolver: zodResolver(RoomResponsesSchema),
    values: { responses },
    mode: 'onChange'
  })

  const { control, formState: { isValid, isSubmitted}  } = form

  function onSubmit(data : RoomResponsesType) {
    submitAnswerChoices(
      data.responses
        .filter(r => r.isCorrect)
        .map(r =>  r.id)
    )
  }

  return(
    <Form {...form}>
      <form id="form-room-responses" onSubmit={form.handleSubmit(onSubmit)}>

        <div className="my-5 grid gap-4 md:grid-cols-2 md:gap-8">
          {responses.map((item, index) => (
            <div key={item.id} className="min-h-24 rounded-xl border bg-accent shadow-sm transition-colors hover:bg-primary/5 has-[input:checked]:bg-primary/5">

              <FormField
                control={control}
                name={`responses.${index}.isCorrect`}
                render={({ field }) => (
                  <FormItem className="size-full">
                    <FormControl className="size-full">
                      <div className="relative size-full">
                        <label className="flex size-full cursor-pointer items-center justify-start overflow-hidden" htmlFor={'qr-' + index}>
                          <span className="whitespace-break-spaces py-5 pl-5 pr-16">{item.text}</span>
                        </label>
                        <Checkbox id={'qr-' + index} onCheckedChange={field.onChange} className="absolute right-5 top-2/4 mt-[-14px] size-7" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

            </div>
          ))}
        </div>

        <Button className="m-auto mt-4 block h-12 w-full sm:h-10 sm:w-36" type="submit" disabled={!isValid || isSubmitted}>
          {t('Submit')}
        </Button>
      </form>
    </Form>
  )
}
