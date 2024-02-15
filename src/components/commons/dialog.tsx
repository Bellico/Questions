import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { PropsWithChildren } from 'react'

type YesNoDialogActionProps ={
  titleDialog : string,
  descDialog? : string,
  action: () => void | Promise<unknown>
}

export const YesNoDialogAction = ({
  titleDialog,
  descDialog,
  action,
  children
}: PropsWithChildren<YesNoDialogActionProps>) => {
  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titleDialog}</AlertDialogTitle>
          {descDialog && <AlertDialogDescription>{descDialog}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => action()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
