import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
  submitAnswerChoices: (choices: string[]) => Promise<void>
} & RoomResponsesType

export function RoomResponses({ responses, submitAnswerChoices }: RoomResponsesProps) {

  responses.forEach(r => r.isCorrect = false)

  const form = useForm<RoomResponsesType>({
    resolver: zodResolver(RoomResponsesSchema),
    values: { responses },
    mode: 'onChange'
  })

  const { control, formState: { isValid, isSubmitting}  } = form

  async function onSubmit(data : RoomResponsesType) {
    await submitAnswerChoices(
      data.responses
        .filter(r => r.isCorrect)
        .map(r =>  r.id)
    )
  }

  return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>

        <div className="my-5 grid gap-4 md:grid-cols-2 md:gap-8">
          {responses.map((item, index) => (
            <div key={item.id} className="h-24 rounded-xl border bg-accent transition-colors hover:bg-primary/5">

              <FormField
                control={control}
                name={`responses.${index}.isCorrect`}
                render={({ field }) => (
                  <FormItem className='size-full'>
                    <FormControl className='size-full'>
                      <div className="relative size-full">
                        <label className="flex size-full cursor-pointer items-center justify-start overflow-hidden pl-5" htmlFor={'qr-' + index}>
                          <span className='md:w-[90%]'>{item.text}</span>
                        </label>
                        <Checkbox id={'qr-' + index} onCheckedChange={field.onChange} className='absolute right-5 top-2/4 mt-[-14px] size-7' />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

            </div>
          ))}
        </div>

        <Button className="m-auto block w-full sm:w-32" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting && <Loader2 className="-ml-1 mr-3 animate-spin" />}
            Submit
        </Button>
      </form>
    </Form>
  )
}