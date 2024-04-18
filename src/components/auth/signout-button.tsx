'use client'

import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useTransition } from 'react'
import { useTranslation } from 'react-i18next'

export default function SignOutButton() {
  const { t } = useTranslation('global')
  const [isPending, startTransition] = useTransition()

  return (
    <Button size="icon"
      title={t('SignOut')}
      onClick={() => {
        startTransition(async () => {
          await signOut()
          redirect('/')
        })
      }}>
      {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
    </Button>
  )
}
