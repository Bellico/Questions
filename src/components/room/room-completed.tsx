import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import Link from 'next/link'

export function RoomCompleted() {
  return(
    <section className="size-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container flex h-full items-center justify-center px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="animate-zoomInEnd space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            All questions are completed !
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Create share learn, simply
            </p>
          </div>
          <div className='animate-fadeIn opacity-0 delay-500'>
            <Link href={'/start/1'}>
              <Button className="mr-4">
                <Play className="mr-2 size-4" />
              Start
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
