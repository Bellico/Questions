"use client"

import { deleteQuestionGroup } from "@/actions/editor-actions";
import { OverloadSpinner } from "@/components/commons/spinner";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useTransition } from "react";

type QuestionsTableProps = {
  groupId: string
};

export function QuestionGroupsListOptions({ groupId }: QuestionsTableProps) {

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

  return (
    <>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>See results</DropdownMenuItem>
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <Link href="/" onClick={() => onDeleteAction()}><DropdownMenuItem>Delete</DropdownMenuItem></Link>
      </DropdownMenuContent>
      {isPending && <OverloadSpinner />}
    </>
  )
}
