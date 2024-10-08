import SignOutButton from '@/components/auth/signout-button'
import { DrawerDialog } from '@/components/commons/drawer-dialog'
import { QEditorIcon } from '@/components/commons/q-editor-icon'
import { ThemeToggle } from '@/components/commons/theme-toogle'
import { Button } from '@/components/ui/button'
import { UserSettings } from '@/components/users/user-settings'
import { translate } from '@/queries/utils-queries'
import { USER_DIALOG } from '@/stores/app-store'
import { UserRoundCog } from 'lucide-react'
import Link from 'next/link'

type BoardHeaderProps = {
  locale: string,
  username: string | null,
  usePassword: boolean,
}

export const BoardHeader = async (props: BoardHeaderProps & { email: string}) => {
  const { t } = await translate('global')

  return (
    <header className="bg-accent">
      <div className="container flex h-16 items-center px-8">
        <nav className="flex flex-row items-center gap-6 text-sm font-medium md:gap-5">
          <Link className="flex items-center gap-2 font-bold" href="/board">
            <QEditorIcon colored className="size-6" />
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
          {/* User settings */}
          <DrawerDialog
            dialogId={USER_DIALOG}
            title={t('Preferences')}
            description={t('PreferencesDesc')}
            trigger={<Button size="icon" variant="outline"><UserRoundCog /></Button>}>
            <UserSettings {...props} password={null} />
          </DrawerDialog>
          {/* Theme toggle */}
          <ThemeToggle />
          {/* SignOut */}
          <SignOutButton />
        </div>
      </div>
    </header>
  )
}
