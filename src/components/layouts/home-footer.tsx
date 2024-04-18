import SubscribeForm from '@/components/auth/subscribe-form'
import { QEditorIcon } from '@/components/commons/q-editor-icon'
import Link from 'next/link'

export const HomeFooter = () => (
  <footer className="py-24">
    <div className="container text-center">
      <div className="flex justify-between">
        <Link className="flex items-center gap-2 text-lg font-bold" href="/">
          <QEditorIcon colored className="size-8" />
          Questions Editor
        </Link>
        <div className="w-full max-w-[29rem] space-y-2">
          <SubscribeForm />
        </div>
      </div>
      <div className="my-5 h-[2px] rounded-md bg-foreground/30"></div>
      <p className="text-second text-center text-xs tracking-wide">
        ©{new Date().getFullYear()} <Link className="underline" href="https://github.com/Bellico/Questions">Bellico</Link>
      </p>
    </div>
  </footer>
)
