'use client'

import { Button } from '@/components/ui/button'
import { Loader2, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useTransition } from 'react'

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <Button size="icon"
      title='Sign out'
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
