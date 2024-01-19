import { OverloadSpinner } from "@/components/commons/spinner";
import { useQuestionsEditorContext, useQuestionsEditorPersist } from "@/components/providers/questions-editor-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { QuestionGroupType } from "@/lib/schema";
import { ActionResultType, mapToArray } from "@/lib/utils";
import { ArrowBigLeft, ArrowDownToLine } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useShallow } from 'zustand/react/shallow';

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
    }, [persist, useDraft]);

    const { toast } = useToast()
    const [isPending, startTransition] = useTransition();

    const onSubmitEditor = async () => {
        const questionsToSave = mapToArray(questionsMap).filter(q => !!q.subject);

        startTransition(async () => {
            const result = await saveGroupAction({
                id: groupId,
                name: groupName,
                questions: questionsToSave
            })

            if (result.success) {
                toast({
                    variant: "success",
                    title: "Group " + (result.data ? "created !" : "updated !"),
                })

                persist?.clearStorage()

                redirect('/board')
            } else {
                toast({
                    variant: "destructive",
                    title: "Error action",
                    description: result.message,
                })
            }
        })
    }

    const onBack = () => {
        persist?.clearStorage()
        redirect('/board')
    }

    return (
        <div className="my-12 flex justify-center">
            {questionsMap.size > 0 &&
                <form action={onSubmitEditor}>
                    <Button className="mr-2"><ArrowDownToLine className="mr-2 h-4 w-4" />Save</Button>
                </form>}

            <form action={onBack}>
                <Button variant="secondary"><ArrowBigLeft className="mr-2 h-4 w-4" />Back</Button>
            </form>

            {isPending && <OverloadSpinner />}
        </div>
    )
}
