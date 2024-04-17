import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

type YesNoDialogActionProps ={
  titleDialog : string,
  descDialog? : string,
  action: () => void | Promise<unknown>
}

export const YesNoDialog = ({
  titleDialog,
  descDialog,
  action,
  children
}: PropsWithChildren<YesNoDialogActionProps>) => {

  const { t } = useTranslation(['global'])

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titleDialog}</AlertDialogTitle>
          {descDialog && <AlertDialogDescription>{descDialog}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={() => action()}>{t('Continue')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
