import { ThemeToggle } from '@/components/theme/theme-toogle'
import { LayoutDashboardIcon } from 'lucide-react'

export const HomeHeader = () => (
  <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container px-6 py-3">
      <div className="flex items-center justify-between">
        <a className="flex items-center gap-2 text-sm font-medium" href="#">
          <LayoutDashboardIcon className="size-6" />
            Questions Editor
        </a>
        <div className="ml-auto items-center lg:flex">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
)
