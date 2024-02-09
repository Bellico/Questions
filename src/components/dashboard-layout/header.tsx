import SignOutButton from '@/components/auth/signout-button'
import { ThemeToggle } from '@/components/theme/theme-toogle'
import { Button } from '@/components/ui/button'
import { ArrowBigLeftDash, LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'

export const DashboardHeader = () => (
  <header className="bg-accent">
    <div className="container flex h-16 items-center px-8">
      <nav className="flex flex-row items-center gap-6 text-sm font-medium md:gap-5">
        <Link className="flex items-center gap-2 font-bold" href="/board">
          <LayoutDashboardIcon className="size-6" />
          Questions Editor
        </Link>
        <Link className="hidden text-gray-500 dark:text-gray-400" href="#">
          Statistics
        </Link>
        <Link className="hidden text-gray-500 dark:text-gray-400" href="#">
          Settings
        </Link>
      </nav>
      <div className="ml-auto flex w-auto gap-2">
        <SignOutButton />
        <ThemeToggle />
      </div>
    </div>
  </header>
)

export const RoomHeader = () => (
  <header className="border-b">
    <div className="container flex h-16 items-center px-8">
      <div className="mr-auto flex  flex-1 gap-2">
        <Button variant="outline"><ArrowBigLeftDash className="mr-2" />Prev</Button>
      </div>
      <div className="flex flex-auto items-center justify-center gap-2 text-sm font-bold">
        <LayoutDashboardIcon className="size-6" />
            Questions Editor
      </div>
      <div className="ml-0 flex flex-1 justify-end gap-2">
        <Button variant="outline">Close</Button>
        <ThemeToggle />
      </div>
    </div>
  </header>
)
