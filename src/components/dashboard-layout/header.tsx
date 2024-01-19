import SignOutButton from "@/components/auth/signout-button";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";

export const DashboardHeader = () => (
  <header className="border-b">
    <div className="container flex items-center h-16 px-8">
      <nav className="flex flex-row gap-6 text-sm font-medium items-center md:gap-5">
        <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
          <LayoutDashboardIcon className="w-6 h-6" />
        </Link>
        <Link className="font-bold" href="/board">
          Questions Editor
        </Link>
        <Link className="text-gray-500 dark:text-gray-400 hidden" href="#">
          Statistics
        </Link>
        <Link className="text-gray-500 dark:text-gray-400 hidden" href="#">
          Settings
        </Link>
      </nav>
      <div className="flex gap-2 w-auto ml-auto">
        <SignOutButton />
        <ThemeToggle />
      </div>
    </div>
  </header>
)

