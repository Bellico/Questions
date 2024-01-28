import { auth } from '@/lib/auth'
import dynamic from 'next/dynamic'

const EditorComp = dynamic(() => import('../../../../components/room/markdown-reader'), {
  ssr: false,
})

export default async function SessionPage({
  params
}: {
params: { id: string }
}) {
  const session = await auth()

  return (
    <section className="animate-zoomIn py-12">
      <div className="container">
      working....
        <EditorComp />
      </div>
    </section>
  )
}
