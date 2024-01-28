import { getGroupForStart } from '@/actions/queries'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

const EditorComp = dynamic(() => import('../../../../components/room/markdown-reader'), {
  ssr: false,
})

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

  return (
    <section className="animate-moveToLeft py-12">
      <div className="container">

        <h1 className="my-12 text-center text-4xl font-extrabold md:text-5xl lg:text-6xl">
          {group.name}
        </h1>

        <p className="my-12 text-center text-3xl font-bold text-gray-500 dark:text-gray-400">
          {group._count.questions} questions
        </p>

        <h3 className="text-center text-lg font-semibold">Configuration</h3>

        <p>Affichage Vertical / Horizontal</p>
        <p>Chronometrer</p>
        <p>Question aleatoire</p>
        <p>Affichier les bonne reponse  ou a la fin</p>
        <p>resultate ? z</p>

        <button>S'entrainer</button>
        <button>S'évaluer</button>
        <button>Commencer</button>
        <button>Partager cette configuration</button>

        <Link href={`/session/${group.id}`}>
          <Button className="mr-4" variant="secondary">
            Start Session
          </Button>
        </Link>

      </div>
    </section>
  )
}
