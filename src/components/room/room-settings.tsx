'use client'

import { startRoom } from '@/actions/room-actions'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useAction } from '@/hooks/useAction'
import { RoomSettingsSchema, RoomSettingsType } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Play, Share } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'

export function RoomSettings(settings: RoomSettingsType) {
  const form = useForm<RoomSettingsType>({
    resolver: zodResolver(RoomSettingsSchema),
    values: settings,
  })

  const { control, getValues } = form

  const requestAction = useAction()

  async function start(){
    requestAction(
      () => startRoom(getValues()),
      (data) => redirect(`/room/${data}`),
    )
  }

  function share(){
    console.log(getValues())
  }

  return(
    <Form {...form}>
      <form className="m-auto space-y-6 lg:w-2/3">

        <FormField
          control={control}
          name="display"
          render={({ field }) => (
            <FormItem className="rounded-lg border bg-background p-4">
              <FormLabel className="text-base">Display</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-6">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Vertical" />
                      </FormControl>
                      <FormLabel className="font-normal">Vertical</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Horizontal" />
                      </FormControl>
                      <FormLabel className="font-normal">Horizontal</FormLabel>
                    </FormItem>
                  </RadioGroup>
                  <FormDescription>Show questions next to or below the subject.</FormDescription>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  <FormDescription>Training will have no impact on your stats.</FormDescription>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="withTimer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Timer</FormLabel>
                <FormDescription>The questionnaire will be timed for each question.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

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
          name="withCorrection"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Correction</FormLabel>
                <FormDescription>The correct answers will be displayed for each question after answering.</FormDescription>
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
                <FormLabel className="text-base">Show results</FormLabel>
                <FormDescription>Final results will be displayed at the end.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='space-x-4 text-center'>
          <Button onClick={(e) => { e.preventDefault(); start()}}><Play className="mr-2" />Start now</Button>
          <Button onClick={(e) => { e.preventDefault(); share()}} variant="secondary"><Share className="mr-2" />Get a share link</Button>
        </div>
      </form>
    </Form>
  )
}