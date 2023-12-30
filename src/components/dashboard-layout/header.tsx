import SignOutButton from "@/components/auth/signout-button";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";

export const DashboardHeader = () => (
  <header className="flex items-center h-16 px-8 border-b">
    <nav className="flex flex-row gap-6 text-lg font-medium md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="#">
        <LayoutDashboardIcon className="w-6 h-6" />
      </Link>
      <Link className="font-bold" href="#">
        Questions Editor
      </Link>
      <Link className="text-gray-500 dark:text-gray-400" href="#">
        Statistics
      </Link>
      <Link className="text-gray-500 dark:text-gray-400" href="#">
        Reports
      </Link>
      <Link className="text-gray-500 dark:text-gray-400" href="#">
        Settings
      </Link>
    </nav>
    <div className="flex gap-2 w-full lg:w-auto lg:ml-auto">
      <SignOutButton />
      <ThemeToggle />
    </div>
  </header>
)

