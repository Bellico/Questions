'use client'

import { deleteQuestionGroup, duplicateQuestionGroup } from '@/actions/editor-actions'
import { YesNoDialogAction } from '@/components/commons/dialog'
import { AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useAction } from '@/hooks/useAction'
import Link from 'next/link'

type QuestionsTableProps = {
  groupId: string
}

export function QuestionGroupsListActions({ groupId }: QuestionsTableProps) {

  const requestAction = useAction()

  async function onDeleteAction(){
    requestAction(
      () => deleteQuestionGroup(groupId),
      () => {},
      'Group deleted'
    )
  }

  async function onDuplicateAction(){
    requestAction(
      () => duplicateQuestionGroup(groupId),
      () => {},
      'Group duplicated'
    )
  }

  return (
    <YesNoDialogAction action={onDeleteAction} titleDialog='Are you absolutely sure?' descDialog='This will permanently delete your account and remove your data from our servers.'>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <Link href={'/results'}>
          <DropdownMenuItem>See results</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDuplicateAction()}>Duplicate</DropdownMenuItem>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </AlertDialogTrigger>
      </DropdownMenuContent>
    </YesNoDialogAction>
  )
}
