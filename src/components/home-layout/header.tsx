import { ThemeToggle } from "@/components/theme/theme-toogle";

export const HomeHeader = () => (
  <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          <a className="text-xl font-bold" href="#">
            Questions Editor
          </a>
        </div>
        <div className="lg:flex items-center ml-auto">
          <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
            <ul className="flex space-x-8">
              <li>
                <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#">Home</a>
              </li>
            </ul>
          </nav>
          <ThemeToggle className="ml-6" />
        </div>
      </div>
    </div>
  </header>
)

