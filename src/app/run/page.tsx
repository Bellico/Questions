import { ThemeToggle } from '@/components/theme/theme-toogle'
import { Button } from '@/components/ui/button'
import { LayoutDashboardIcon } from 'lucide-react'
import dynamic from 'next/dynamic'

const EditorComp = dynamic(() => import('../../components/run/runnor'), {
  ssr: false,
})

export default function RunPage() {
  return (
    <>
      <header className="border-b">
        <div className="container flex h-16 items-center px-8">
          <div className="mr-auto flex  flex-1 gap-2">
            <Button variant="outline">Save</Button>
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
      <main>
        <section className="py-12">
          <div className="container">
            <h1 className="mb-12 text-center text-3xl font-semibold">
              Question toutotu
            </h1>

            <EditorComp />
          </div>
        </section>
      </main>
    </>
  )
}
