import { Fira_Mono } from 'next/font/google'
import './404.css'

const fira = Fira_Mono({
  weight: '400',
  subsets: ['latin'],
})

export default function NotFound() {
  return (
    <main className={fira.className}>
      <div className="flex h-screen items-center justify-center bg-background text-9xl tracking-tighter text-foreground">
        <div className="title_404 text-foreground" title="404">
        404
        </div>
      </div>
    </main>
  )
}
