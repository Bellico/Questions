import { updateQuestionGroupAction } from '@/actions/editor/update-question-group-actions'
import { getEditorQuery } from '@/actions/queries'
import { QuestionsEditor } from '@/components/editor/questions-editor'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'

export const maxDuration = 10

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { useDraft: boolean }
}) {
  const session = await auth()

  const useDraft = Boolean(searchParams.useDraft)

  if (useDraft) {
    return <QuestionsEditor useDraft saveGroupAction={updateQuestionGroupAction} />
  }

  const questionGroup = await getEditorQuery(params.id, session?.user.id!)

  if (!questionGroup) {
    notFound()
  }

  return (
    <QuestionsEditor
      questionGroup={questionGroup}
      saveGroupAction={updateQuestionGroupAction}
    />
  )
}
