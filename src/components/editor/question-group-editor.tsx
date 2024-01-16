"use client";

import { OverloadSpinner } from "@/components/commons/spinner";
import { QuestionEditorSection } from "@/components/editor/question-editor-section";
import { QuestionsEditorProvider, useQuestionsEditorContext } from "@/components/providers/questions-editor-provider";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAccordionState } from "@/hooks/useAccordionState";
import { useDebounce } from "@/hooks/utils";
import { QuestionGroupType } from "@/lib/schema";
import { ActionResultType, mapToArray } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowBigLeft, ArrowDownToLine, ChevronsDownUp, ChevronsUpDown, Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useShallow } from 'zustand/react/shallow';

type QuestionGroupEditorProps = {
  questionGroup?: QuestionGroupType,
  saveGroupAction: (values: QuestionGroupType) => Promise<ActionResultType<string | void>>;
};

function _QuestionGroupEditor({ saveGroupAction }: QuestionGroupEditorProps) {

  const [groupId, groupName, questionsMap, addNewQuestion, updateName, removeQuestion] = useQuestionsEditorContext(
    useShallow((s) => [s.id, s.name, s.questionsMap, s.addQuestion, s.updateGroupName, s.removeQuestion]),
  )

  const [accordionState, toggleExpand, expandAll, collapseAll] = useAccordionState(questionsMap)

  const { toast } = useToast()
  const [isPending, startTransition] = useTransition();

  const updateNameDebounced = useDebounce((value) => {
    updateName(value)
  }, 300)

  // Strange ! ->  https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

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

  let index = 1;
  return (
    <>
      <div className="container">
        <div className="my-12 flex justify-end">
          {questionsMap.size > 0 &&
            <form action={onSubmitEditor}>
              <Button className="mr-2"><ArrowDownToLine className="mr-2 h-4 w-4" />Save</Button>
            </form>}
          <Link href="/board">
            <Button variant="secondary"><ArrowBigLeft className="mr-2 h-4 w-4" />Back</Button>
          </Link>
        </div>

        <label htmlFor="email" className="relative block xl:w-9/12 mx-auto m-16">
          <Pencil className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-3" />
          <Input
            className="border-0 p-3 text-xl mb-4 text-center"
            id="email"
            placeholder="Enter a name for this group"
            type="text"
            defaultValue={groupName}
            onChange={(e) => updateNameDebounced(e.target.value)}
          />
        </label>
      </div>

      <Accordion type="multiple" value={accordionState}>
        {[...questionsMap].map(([key, value]) => (
          <AccordionItem key={key} id={'q-' + key} value={key}>

            <div className="py-4 font-medium bg-accent border-solid border-t-2 cursor-default">
              <div className="container flex items-center">
                <div>
                  <span className="mr-1">Question {index}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400"> - {value.responses.length} response(s)</span>
                </div>
                {isClient &&
                  <div className="flex-1 text-right">
                    {questionsMap.size > 1 && <Button className="mr-2" variant="destructive" onClick={() => removeQuestion(key)}>Remove</Button>}
                    <Button className="mr-2" variant="outline" onClick={() => toggleExpand(key)}>{accordionState.includes(key) ? 'Hide' : 'Show'}</Button>
                    <Button className="mr-2" variant="ghost" onClick={() => expandAll()}><ChevronsUpDown className="h-3 w-3" /></Button>
                    <Button variant="ghost" onClick={() => collapseAll()}><ChevronsDownUp className="h-3 w-3" /></Button>
                  </div>}
              </div>
            </div>

            <AccordionContent>
              <QuestionEditorSection keyMap={key} indexQuestion={index++} question={value} />
            </AccordionContent>

          </AccordionItem>
        ))}
      </Accordion>

      <Button variant="secondary" onClick={() => addNewQuestion()} className="w-full">Add new question</Button>
      {isPending && <OverloadSpinner />}
    </>
  )
}

export default function QuestionGroupEditor({ questionGroup, saveGroupAction }: QuestionGroupEditorProps) {
  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}>
        <QuestionsEditorProvider value={questionGroup}>
          <_QuestionGroupEditor saveGroupAction={saveGroupAction} />
        </QuestionsEditorProvider>
      </motion.div>
    </>
  )
}
