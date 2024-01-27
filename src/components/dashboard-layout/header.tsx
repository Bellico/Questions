import SignOutButton from '@/components/auth/signout-button'
import { ThemeToggle } from '@/components/theme/theme-toogle'
import { LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'

export const DashboardHeader = () => (
  <header className="border-b">
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
