import { canPlayRoom, getNextQuestionToAnswer } from '@/actions/queries'
import { auth } from '@/lib/auth'
import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

const EditorComp = dynamic(() => import('../../../../components/room/markdown-reader'), {
  ssr: false,
})

export default async function SessionPage({
  params
}: {
params: { id: string, shareLink?: string }
}) {
  const session = await auth()
  const room = await canPlayRoom(params.id, session?.user.id!, params.shareLink)
  if(!room){
    redirect('/')
  }

  const question = await getNextQuestionToAnswer(room.id)

  return (
    <section className="animate-zoomIn py-12">
      <div className="container">
        working....
        room nro :  {params.id}
        questino : {JSON.stringify(question)}
        <EditorComp />
      </div>
    </section>
  )
}
