import { getActiveRoom, getGroupForStart, getLastSettingsRoom } from '@/actions/queries'
import { RoomSettings } from '@/components/room/room-settings'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'

export default async function StartPage({
  params
}: {
params: { id: string }
}) {
  const session = await auth()
  if (!session) {
    redirect('/')
  }

  const group = await getGroupForStart(params.id, session.user.id!)
  if (!group) {
    notFound()
  }

  const activeRoom = await getActiveRoom(group.id, session.user.id!)
  if(activeRoom){
    redirect(`/room/${activeRoom.id}`)
  }

  const lastSettings = await getLastSettingsRoom(group.id, session.user.id!)

  return (
    <section className="animate-moveToLeft py-12">
      <div className="container">

        <h1 className="my-12 text-center text-4xl font-extrabold md:text-5xl lg:text-6xl">
          {group.name}
        </h1>

        <p className="my-12 text-center text-3xl font-bold text-gray-500 dark:text-gray-400">
          {group._count.questions} questions
        </p>

        <RoomSettings {...lastSettings} />
      </div>
    </section>
  )
}
