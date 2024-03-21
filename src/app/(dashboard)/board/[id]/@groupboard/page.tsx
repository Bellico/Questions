import { getGroupName } from '@/actions/queries'
import { Spinner } from '@/components/commons/spinner'
import { AnswersList } from '@/components/groupboard/answers-list'
import { RoomsList } from '@/components/groupboard/rooms-list'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { Pencil, Play } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function GroupBoardPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  return (
    <div className="bg-accent">

      <section>
        <div className="container">
          <h1 className="title">{await getGroupName(params.id)}</h1>

          <div className="my-12 flex justify-center">
            <Link href={`/start/${params.id}`}>
              <Button className="mr-2" size="lg"><Play className="mr-2 size-4" />Start</Button>
            </Link>

            <Link href={`/editor/${params.id}`}>
              <Button variant="secondary" size="lg"><Pencil className="mr-2 size-4" />Edit</Button>
            </Link>
          </div>

          <Suspense fallback={<Spinner />}>
            <RoomsList userId={session?.user.id!} groupId={params.id} mode='Rating' />
          </Suspense>

        </div>
      </section>

      <section>
        <div className="container">

          <Suspense fallback={<Spinner />}>
            <AnswersList userId={session?.user.id!} groupId={params.id} />
          </Suspense>

        </div>
      </section>
    </div>
  )
}
