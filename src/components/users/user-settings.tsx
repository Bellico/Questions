'use client'

import { updateUserSettingsAction } from '@/actions/users/update-user-settings-action'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAction } from '@/hooks/useAction'
import { UserSettingsSchema, UserSettingsType } from '@/lib/schema'
import { USER_DIALOG, useAppStore } from '@/stores/app-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export function UserSettings(data: UserSettingsType) {
  const  [setDialogOpen, setDialogLoading] = useAppStore((s) => [s.setDialogOpen, s.setDialogLoading])
  const { t } = useTranslation(['global', 'actions'])
  const router = useRouter()

  const form = useForm<UserSettingsType>({
    resolver: zodResolver(UserSettingsSchema),
    values: data,
  })

  const {control, register, handleSubmit, formState: { isValid} } = form
  const requestAction = useAction(false)

  const updateUserSettings = async (data: UserSettingsType) => {
    setDialogLoading(true)
    requestAction(
      () => updateUserSettingsAction(data),
      () => {
        setDialogOpen(USER_DIALOG, false)
        router.refresh()
      },
      t('PreferencesUpdated', { ns: 'actions'})
    )
  }

  return (
    <Form {...form}>
      <form id="form-user-settings" onSubmit={handleSubmit(updateUserSettings)} noValidate className="grid items-start gap-6">

        <div className="grid gap-2">
          <Label htmlFor="username">{t('Username')}</Label>
          <Input id="username" {...register('username')} />
        </div>

        <FormField
          control={control}
          name="locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">{t('Language')}</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-6">
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fr" />
                      </FormControl>
                      <FormLabel className="font-normal">{t('French')}</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="en" />
                      </FormControl>
                      <FormLabel className="font-normal">{t('English')}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!isValid}>{t('Save')}</Button>
      </form>
    </Form>
  )
}
