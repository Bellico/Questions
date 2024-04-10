'use client'

import { deleteQuestionGroupAction } from '@/actions/editor/delete-question-group-action'
import { duplicateQuestionGroupAction } from '@/actions/editor/duplicate-question-group-action'
import { abortRoomAction } from '@/actions/room/abort-room-action'
import { YesNoDialogAction } from '@/components/commons/yes-no-dialog'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useAction } from '@/hooks/useAction'
import { downloadBlob } from '@/lib/utils'
import { useRef } from 'react'

type QuestionsTableProps = {
  groupId: string,
  roomInProgress: boolean
}

export function QuestionGroupsListActions({ groupId, roomInProgress }: QuestionsTableProps) {
  const dropDownRef = useRef<HTMLDivElement>(null)
  const requestAction = useAction()

  async function onAbortAction(){
    requestAction(
      () => abortRoomAction(groupId),
      () => {},
      'Aborted'
    )
  }

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

  async function onExportAction(){
    const res = await fetch(`/api/export?id=${groupId}`)
    await downloadBlob(res)
  }

  return (
    <DropdownMenuContent ref={dropDownRef} align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {roomInProgress &&
        <YesNoDialogAction action={onAbortAction} titleDialog='Are you absolutely sure?' descDialog='You will lose your last answers.'>
          <DropdownMenuItem className="text-destructive" onSelect={(e) => {e.preventDefault(); dropDownRef.current?.remove()}}>Abort</DropdownMenuItem>
        </YesNoDialogAction>
      }
      <DropdownMenuItem onClick={() => onExportAction()}>Export</DropdownMenuItem>
      <DropdownMenuItem onClick={() => onDuplicateAction()}>Duplicate</DropdownMenuItem>
      <YesNoDialogAction action={onDeleteAction} titleDialog='Are you absolutely sure?' descDialog='You will lose all scores and results for this group.'>
        <DropdownMenuItem onSelect={(e) => {e.preventDefault(); dropDownRef.current?.remove()}}>Delete</DropdownMenuItem>
      </YesNoDialogAction>
    </DropdownMenuContent>
  )
}
