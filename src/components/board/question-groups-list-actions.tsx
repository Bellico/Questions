'use client'

import { deleteQuestionGroup, duplicateQuestionGroup } from '@/actions/editor-actions'
import { YesNoDialogAction } from '@/components/commons/dialog'
import { OverloadSpinner } from '@/components/commons/spinner'
import { AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { useTransition } from 'react'

type QuestionsTableProps = {
  groupId: string
}

export function QuestionGroupsListActions({ groupId }: QuestionsTableProps) {

  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const onDeleteAction = async () => {
    startTransition(async () => {
      const result = await deleteQuestionGroup(groupId)

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error action',
          description: result.message,
        })
      }
    })
  }

  const onDuplicateAction = async () => {
    startTransition(async () => {
      const result = await duplicateQuestionGroup(groupId)

      if (result.success) {
        toast({
          variant: 'success',
          title: 'Group duplicated',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error action',
          description: result.message + ' ' + JSON.stringify(result.errors)
        })
      }
    })
  }

  return (
    <>
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
      {isPending && <OverloadSpinner />}
    </>
  )
}
