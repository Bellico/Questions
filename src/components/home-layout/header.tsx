import { ThemeToggle } from '@/components/commons/theme-toogle'
import { LayoutDashboardIcon } from 'lucide-react'
import Link from 'next/link'

export const HomeHeader = () => (
  <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-16 items-center px-8">
      <nav className="flex flex-row items-center gap-6 text-sm font-medium md:gap-5">
        <Link className="flex items-center gap-2 font-bold" href="/">
          <LayoutDashboardIcon className="size-6" />
          Questions Editor
        </Link>
      </nav>
      <div className="ml-auto flex w-auto gap-2">
        <ThemeToggle />
      </div>
    </div>
  </header>
)
