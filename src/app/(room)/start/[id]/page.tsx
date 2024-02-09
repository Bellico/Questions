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
    <section className="animate-moveToLeft">
      <div className="container">

        <h1 className="title">
          {group.name}
        </h1>

        <p className="mb-6 text-center text-3xl font-bold text-gray-500 lg:mb-12 dark:text-gray-400">
          {group._count.questions} questions
        </p>

        <RoomSettings {...lastSettings} />
      </div>
    </section>
  )
}
