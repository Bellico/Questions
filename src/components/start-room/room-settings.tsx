'use client'

import { startRoomAction } from '@/actions/room/start-room-action'
import { ShareDialog } from '@/components/start-room/share-dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useAction } from '@/hooks/useAction'
import { RoomSettingsSchema, RoomSettingsType } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { RoomMode } from '@prisma/client'
import { Play } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export function RoomSettings(settings: RoomSettingsType) {
  const form = useForm<RoomSettingsType>({
    resolver: zodResolver(RoomSettingsSchema),
    values: settings,
    mode: 'onChange'
  })

  const { control, getValues, setValue, clearErrors } = form
  const { mode, withCorrection } = getValues()

  const requestAction = useAction()

  useEffect(() => {
    if(mode === RoomMode.Rating && withCorrection)
      setValue('withCorrection', false)

    if(mode === RoomMode.Training) {
      setValue('withRetry', 0)
      clearErrors('withRetry')
    }
  }, [setValue, clearErrors, mode, withCorrection])

  async function start(){
    requestAction(
      () => startRoomAction(getValues()),
      (data) => redirect(`/room/${data}`),
    )
  }

  return(
    <Form {...form}>
      <form id="form-room-settings" className="m-auto space-y-6 lg:w-2/3">

        <FormField
          control={control}
          name="mode"
          render={({ field }) => (
            <FormItem className="rounded-lg border bg-background p-4">
              <FormLabel className="text-base">Mode</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-6">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Training" />
                      </FormControl>
                      <FormLabel className="font-normal">Training</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Rating" />
                      </FormControl>
                      <FormLabel className="font-normal">Rating</FormLabel>
                    </FormItem>
                  </RadioGroup>
                  <FormDescription>
                    Training : Test your questions. Answers and results will not be saved.<br />
                    Rating : Evaluate your knowledge and improve your score.
                  </FormDescription>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === RoomMode.Training &&
          <FormField
            control={form.control}
            name="withCorrection"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Correction</FormLabel>
                  <FormDescription>The correct answers will be displayed before moving on to the next question.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        }

        {mode === RoomMode.Rating &&
          <FormField
            control={form.control}
            name="withRetry"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Number of retries</FormLabel>
                  <FormDescription>Adds retries before saving your scores definitely. (max: 3)</FormDescription>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input className="w-16" type="number" {...field} value={field.value || 0} min="0" max="3" />
                </FormControl>
              </FormItem>
            )}
          />
        }

        <FormField
          control={form.control}
          name="withRandom"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Random</FormLabel>
                <FormDescription>The questions will be displayed randomly.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="withProgress"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Progress bar</FormLabel>
                <FormDescription>Allows to know the progress status and the number of questions.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="withResults"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Summary</FormLabel>
                <FormDescription>The summary of the results will be available at the end.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-x-4 text-center">
          <Button onClick={(e) => { e.preventDefault(); start()}}><Play className="mr-2" />Start now</Button>
          <ShareDialog settingValues={getValues} />
        </div>
      </form>
    </Form>
  )
}
