import { Confetti } from '@/components/commons/confetti'
import { RoomFinalRetry } from '@/components/final/room-final-retry'
import { Button } from '@/components/ui/button'
import { ArrowDownToLine, Group } from 'lucide-react'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

export function RoomFinalHero({
  roomId,
  shareLink,
  canScroll,
  canRetry,
  playConfetti,
  children
} : PropsWithChildren<{
  roomId : string,
  shareLink? : string,
  canScroll : boolean,
  canRetry: boolean
  playConfetti: boolean
}>) {
  return(
    <section className="relative flex min-h-[calc(100vh-65px)] items-center justify-center">

      {playConfetti && <Confetti />}

      <div className="container mt-[-65px] flex flex-col items-center space-y-7 text-center sm:space-y-10">

        <div className="animate-room-final">
          {playConfetti ?
            <h1 className="rainbow_text_animated text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">Well done! Congratulations!</h1> :
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">All questions are completed</h1>
          }
        </div>

        {children}

        <div className="flex animate-fadeIn opacity-0 delay-1000">
          {canRetry &&
            <RoomFinalRetry roomId={roomId} shareLink={shareLink} />
          }

          <Link href={'/'}>
            <Button variant="secondary" className="mr-4 sm:w-36">
              <Group className="mr-2" />
                Leave
            </Button>
          </Link>
        </div>

      </div>

      {canScroll &&
        <div className="absolute inset-x-0 bottom-0 flex animate-bounce flex-col items-center">
          <p>Scroll to yours results</p>
          <ArrowDownToLine />
        </div>
      }

    </section>
  )
}
