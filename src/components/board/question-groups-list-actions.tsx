'use client'

import { deleteQuestionGroupAction } from '@/actions/editor/delete-question-group-action'
import { duplicateQuestionGroupAction } from '@/actions/editor/duplicate-question-group-action'
import { YesNoDialogAction } from '@/components/commons/yes-no-dialog'
import { AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useAction } from '@/hooks/useAction'

type QuestionsTableProps = {
  groupId: string
}

export function QuestionGroupsListActions({ groupId }: QuestionsTableProps) {

  const requestAction = useAction()

  async function onDeleteAction(){
    requestAction(
      () => deleteQuestionGroupAction(groupId),
      () => {},
      'Group deleted'
    )
  }

  async function onDuplicateAction(){
    requestAction(
      () => duplicateQuestionGroupAction(groupId),
      () => {},
      'Group duplicated'
    )
  }

  return (
    <YesNoDialogAction action={onDeleteAction} titleDialog='Are you absolutely sure?' descDialog='You will lose all scores and results for this group.'>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDuplicateAction()}>Duplicate</DropdownMenuItem>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </AlertDialogTrigger>
      </DropdownMenuContent>
    </YesNoDialogAction>
  )
}
