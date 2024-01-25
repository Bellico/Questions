"use client"

import { deleteQuestionGroup, duplicateQuestionGroup } from "@/actions/editor-actions";
import { OverloadSpinner } from "@/components/commons/spinner";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useTransition } from "react";

type QuestionsTableProps = {
  groupId: string
};

export function QuestionGroupsListActions({ groupId }: QuestionsTableProps) {

  const { toast } = useToast()
  const [isPending, startTransition] = useTransition();

  const onDeleteAction = async () => {
    startTransition(async () => {
      const result = await deleteQuestionGroup(groupId)

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error action",
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
          variant: "success",
          title: "Group duplicated",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error action",
          description: result.message,
        })
      }
    })
  }

  return (
    <>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>See results</DropdownMenuItem>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href="/" onClick={() => onDuplicateAction()}><DropdownMenuItem>Duplicate</DropdownMenuItem></Link>
        <Link href="/" onClick={() => onDeleteAction()}><DropdownMenuItem>Delete</DropdownMenuItem></Link>
      </DropdownMenuContent>
      {isPending && <OverloadSpinner />}
    </>
  )
}
