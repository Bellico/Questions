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
    <section >
      <div className="flex w-full items-center justify-center py-12">
        <div className="space-y-4 text-center">
          <div className="container">
            <h1 className="mb-8 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">Welcome on questions editor</h1>
            <p className="text-2xl leading-loose">
              You have been invited to answer a series of questions. <br /> {room?.group._count.questions} questions await you. <br /> Good Luck !
            </p>
          </div>
          <form action={startShareRoom} className="text-center">
            <Button size="lg">Start</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
