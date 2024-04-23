import { updateQuestionGroupAction } from '@/actions/editor/update-question-group-actions'
import { QuestionsEditor } from '@/components/editor/questions-editor'
import { auth } from '@/lib/auth'
import { getEditorQuery } from '@/queries/pages-queries'
import { notFound } from 'next/navigation'

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { useDraft: boolean }
}) {
  const session = await auth()
  const useDraft = Boolean(searchParams.useDraft)
  const questionGroup = await getEditorQuery(params.id, session?.user.id!)

  if (!questionGroup) {
    notFound()
  }

  return (
    <QuestionsEditor
      useDraft={useDraft}
      questionGroup={questionGroup}
      saveGroupAction={updateQuestionGroupAction}
    />
  )
}
