import { Button } from '@/components/ui/button'
import { ArrowDownToLine, Play } from 'lucide-react'
import Link from 'next/link'

export function RoomCompletedFinal() {
  return(
    <section className="relative flex min-h-[calc(100vh-65px)] items-center justify-center">
      <div className="container mt-[-65px] flex flex-col items-center space-y-7 text-center sm:space-y-10">

        <div className="animate-room-final">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              All questions are completed !
          </h1>
        </div>

        <div className="space-y-3 text-xl sm:space-y-5 sm:text-3xl">
          <div className="animate-fadeIn opacity-0 delay-500">Score 100%</div>
          <div className="animate-fadeIn opacity-0 delay-700">Success 3/3</div>
          <div className="animate-fadeIn opacity-0 delay-1000">Failed 0/3</div>
        </div>

        <div className="animate-fadeIn opacity-0 delay-1000">
          <Link href={'/start/1'}>
            <Button className="mr-4 sm:w-36">
              <Play className="mr-2" />
                Retry
            </Button>
          </Link>

          <Link href={'/board'}>
            <Button variant="secondary" className="mr-4 sm:w-36">
              <Play className="mr-2" />
                Leave
            </Button>
          </Link>

        </div>

      </div>

      <div className="absolute inset-x-0 bottom-0 flex animate-bounce flex-col items-center">
        <p>Scroll to your results</p>
        <ArrowDownToLine />
      </div>
    </section>
  )
}
