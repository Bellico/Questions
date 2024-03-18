import { getGroupForShareQuery } from '@/actions/queries'
import { startShareRoomAction } from '@/actions/room/start-share-room-action'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export default async function StartPage({
  params,
  searchParams
}: {
params: { id: string }
searchParams?: { shareLink?: string }
}) {
  if(!searchParams?.shareLink){
    redirect('/')
  }

  const room = await getGroupForShareQuery(params.id, searchParams.shareLink)
  if (!room) {
    redirect('/')
  }

  if (room.dateStart) {
    redirect(`/room/${params.id}/?shareLink=${searchParams?.shareLink}`)
  }

  async function startShareRoom(){
    'use server'
    const result = await startShareRoomAction({
      roomId: params.id,
      shareLink: searchParams?.shareLink!
    })

    if(result.success){
      redirect(`/room/${params.id}/?shareLink=${searchParams?.shareLink}`)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-8 px-4 text-center">
      <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
          You're invited on Questions Editor
      </h1>

      <p className="text-gray-500 dark:text-gray-400">
        Your friend has invited you to answer at {room?.group._count.questions} questions. Click the button below to get started.
      </p>

      <div className="w-full max-w-sm">
        <form action={startShareRoom} >
          <Button className="w-full">
                Start to answer
          </Button>
        </form>
      </div>
    </section>
  )
}
