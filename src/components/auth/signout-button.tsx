'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function SignOutButton() {
  return (
    <Button size="icon"
      title='Sign out'
      onClick={() => {
        signOut()
        redirect('/')
      }}>
      <LogOut />
    </Button>
  )
}
