import { getActiveRoomQuery, getGroupForStartQuery, getLastSettingsRoomQuery } from '@/actions/queries'
import { RoomSettings } from '@/components/start-room/room-settings'
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

  const group = await getGroupForStartQuery(params.id, session.user.id!)
  if (!group) {
    notFound()
  }

  const activeRoom = await getActiveRoomQuery(group.id, session.user.id!)
  if(activeRoom){
    redirect(`/room/${activeRoom.id}`)
  }

  const lastSettings = await getLastSettingsRoomQuery(group.id, session.user.id!)

  return (
    <section className="animate-moveToLeft">
      <div className="container">

        <h1 className="title">
          {group.name}
        </h1>

        <p className="text-second mb-6 text-center text-3xl font-bold lg:mb-12">
          {group._count.questions} questions
        </p>

        <RoomSettings {...lastSettings} />
      </div>
    </section>
  )
}
