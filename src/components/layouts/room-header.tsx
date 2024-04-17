import { QEditorIcon } from '@/components/commons/q-editor-icon'
import { ThemeToggle } from '@/components/commons/theme-toogle'

export const RoomHeader = () => (
  <header className="border-b">
    <div className="container flex h-16 items-center px-8">
      <div className="mr-auto flex flex-1 gap-2">
      </div>
      <div className="flex flex-auto items-center justify-center gap-2 text-sm font-bold">
        <QEditorIcon colored className="size-6" />
            Questions Editor
      </div>
      <div className="ml-0 flex flex-1 justify-end gap-2">
        <ThemeToggle />
      </div>
    </div>
  </header>
)
