import { useQuestionsEditorContext, useQuestionsEditorPersist } from '@/components/providers/questions-editor-provider'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/useAction'
import { QuestionGroupType } from '@/lib/schema'
import { ActionResultType, mapToArray } from '@/lib/utils'
import { ArrowBigLeft, ArrowDownToLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

type QuestionsEditorActionsProps = {
    saveGroupAction: (values: QuestionGroupType) => Promise<ActionResultType<string | void>>;
    useDraft?: boolean
}

export function QuestionsEditorActions({ useDraft, saveGroupAction }: QuestionsEditorActionsProps) {

  const router = useRouter()
  const requestAction = useAction()
  const persist = useQuestionsEditorPersist()

  const [groupId, groupName, questionsMap] = useQuestionsEditorContext(
    useShallow((s) => [s.id, s.name, s.questionsMap]),
  )

  // Rehydrate draft from storage
  useEffect(() => {
    if (useDraft) persist?.rehydrate()
  }, [persist, useDraft])

  async function onSubmitEditor() {
    const questionsToSave = mapToArray(questionsMap).filter(q => !!q.subject)

    requestAction(
      () => saveGroupAction({
        id: groupId,
        name: groupName,
        questions: questionsToSave
      }),
      () => {
        persist?.clearStorage()
        router.back()
      },
      'Group ' + (!groupId ? 'created !' : 'updated !')
    )
  }

  function onBack() {
    persist?.clearStorage()
    router.back()
  }

  return (
    <div className="my-12 flex justify-center">
      <form id="form-save-editor" action={onSubmitEditor}>
        <Button className="mr-2" size="lg"><ArrowDownToLine className="mr-2 size-4" />Save</Button>
      </form>

      <form id="form-back-editor" action={onBack}>
        <Button variant="secondary" size="lg"><ArrowBigLeft className="mr-2 size-4" />Back</Button>
      </form>
    </div>
  )
}
