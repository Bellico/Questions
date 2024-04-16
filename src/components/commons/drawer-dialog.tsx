'use client'

import { OverloadSpinner } from '@/components/commons/spinner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAppStore } from '@/stores/app-store'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

type DrawerDialogProps = {
  title: string,
  description?: string
  trigger: any
}

export function DrawerDialog({ trigger, title, description, children }: PropsWithChildren<DrawerDialogProps>) {
  const { t } = useTranslation('global')
  const [open, setOpen, isDialogLoading ] = useAppStore((s) => [s.userDialogOpen, s.setUserDialogOpen, s.isDialogLoading])
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {trigger}
          </DialogTrigger>
          <DialogContent className="sm:max-w-screen-sm">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description &&
               <DialogDescription>
                 {description}
               </DialogDescription>
              }
            </DialogHeader>
            {children}
            {isDialogLoading && <OverloadSpinner overloadPage={false} />}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4" >
          {children}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t('Cancel')}</Button>
          </DrawerClose>
        </DrawerFooter>
        {isDialogLoading && <OverloadSpinner overloadPage={false} />}
      </DrawerContent>
    </Drawer>
  )
}
