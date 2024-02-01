import { useQuestionsEditorContext, useQuestionsEditorPersist } from '@/components/providers/questions-editor-provider'
import { Button } from '@/components/ui/button'
import { useAction } from '@/hooks/useAction'
import { QuestionGroupType } from '@/lib/schema'
import { ActionResultType, mapToArray } from '@/lib/utils'
import { ArrowBigLeft, ArrowDownToLine } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

type QuestionsEditorActionsProps = {
    saveGroupAction: (values: QuestionGroupType) => Promise<ActionResultType<string | void>>;
    useDraft?: boolean
}

export function QuestionsEditorActions({ useDraft, saveGroupAction }: QuestionsEditorActionsProps) {

  const [groupId, groupName, questionsMap] = useQuestionsEditorContext(
    useShallow((s) => [s.id, s.name, s.questionsMap]),
  )

  const persist = useQuestionsEditorPersist()

  // Rehydrate draft from storage
  useEffect(() => {
    if (useDraft) persist?.rehydrate()
  }, [persist, useDraft])

  const requestAction = useAction()

  const onSubmitEditor = async () => {
    const questionsToSave = mapToArray(questionsMap).filter(q => !!q.subject)

    requestAction(
      () => saveGroupAction({
        id: groupId,
        name: groupName,
        questions: questionsToSave
      }),
      () => {
        persist?.clearStorage()
        redirect('/board')
      },
      'Group ' + (!groupId ? 'created !' : 'updated !')
    )
  }

  const onBack = () => {
    persist?.clearStorage()
    redirect('/board')
  }

  return (
    <div className="my-12 flex justify-center">
      {questionsMap.size > 0 &&
                <form action={onSubmitEditor}>
                  <Button className="mr-2"><ArrowDownToLine className="mr-2 size-4" />Save</Button>
                </form>}

      <form action={onBack}>
        <Button variant="secondary"><ArrowBigLeft className="mr-2 size-4" />Back</Button>
      </form>
    </div>
  )
}
