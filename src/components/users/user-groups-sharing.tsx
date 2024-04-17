'use client'

import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/useAction'
import { UserSettingsType } from '@/lib/schema'
import { sleep } from '@/lib/utils'
import { SHARE_DIALOG, useAppStore } from '@/stores/app-store'
import { useTranslation } from 'react-i18next'

export function UserGroupsSharing() {
  const  [setDialogOpen, setDialogLoading] = useAppStore((s) => [s.setDialogOpen, s.setDialogLoading])
  const { t } = useTranslation(['global', 'actions'])

  // const form = useForm<UserSettingsType>({
  //   resolver: zodResolver(UserSettingsSchema),
  //   values: data,
  // })

  // const {control, register, handleSubmit, formState: { isValid} } = form
  const requestAction = useAction(false)

  const updateUserSettings = async () => {
    setDialogLoading(true)
    await sleep(5)
    // requestAction(
    //   () => updateUserSettingsAction(data),
    //   () => {
    //     setDialogOpen(USER_DIALOG, false)
    //     router.refresh()
    //   },
    //   t('PreferencesUpdated', { ns: 'actions'})
    // )
    setDialogOpen(SHARE_DIALOG, false)
  }

  return (
    <form id="form-user-settings">
      <h1>Hello everyone</h1>
      <Button type="submit" onClick={(e) => { e.preventDefault(); updateUserSettings()}}>{t('Save')}</Button>
    </form>
  )
}
