"use client";

import { QuestionEditorCard } from "@/components/editor/question-editor-card";
import { QuestionsEditorProvider, useQuestionsEditorContext } from "@/components/providers/questions-editor-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/utils";
import { QuestionGroupType } from "@/lib/schema";
import { ActionResultType, mapToArray } from "@/lib/utils";
import { Mail, MailIcon } from "lucide-react";
import Link from "next/link";
import { useShallow } from 'zustand/react/shallow';

type QuestionGroupEditorProps = {
  questionGroup?: QuestionGroupType,
  saveGroupAction: (values: QuestionGroupType) => Promise<ActionResultType<string | void>>;
};

function _QuestionGroupEditor({ saveGroupAction }: QuestionGroupEditorProps) {

  const [groupId, groupName, questionsMap, addNewQuestion, updateName, removeQuestion] = useQuestionsEditorContext(
    useShallow((s) => [s.id, s.name, s.questionsMap, s.addQuestion, s.updateGroupName, s.removeQuestion]),
  )

  const updateNameDebounced = useDebounce((value) => {
    updateName(value)
  }, 300)

  const onSubmitEditor = async () => {
    const questionsToSave = mapToArray(questionsMap).filter(q => !!q.subject);

    if (questionsToSave.length === 0) {
      console.log('empty')
      return
    }

    const result = await saveGroupAction({
      id: groupId,
      name: groupName,
      questions: questionsToSave
    })

    console.log('Saved', result)
  }

  console.log('render list')

  let index = 1;
  return (
    <>
      <div className="flex justify-end">
        <Link href="/board">
          <Button><Mail className="mr-2 h-4 w-4" />Back</Button>
        </Link>
      </div>

      <label htmlFor="email" className="relative block w-6/12 m-auto">
        <MailIcon className="w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3" />
        <Input
          className="border-t-0 border-l-0 border-r-0 border-b-1 p-3 text-xl mb-4 text-center"
          id="email"
          placeholder="Enter your text here"
          type="text"
          defaultValue={groupName}
          onChange={(e) => updateNameDebounced(e.target.value)}
        />
      </label>

      <Accordion type="multiple" defaultValue={[questionsMap.entries().next()?.value[0]]}>
        {[...questionsMap].map(([key, value]) => (
          <AccordionItem key={key} value={key}>

            <AccordionTrigger>Question {index}</AccordionTrigger>
            <span>{value.responses.length} responses </span>
            <Button variant="link" onClick={() => removeQuestion(key)}>Remove</Button>

            <AccordionContent>
              <QuestionEditorCard keyMap={key} indexQuestion={index++} question={value} />
            </AccordionContent>

          </AccordionItem>
        ))}
      </Accordion>

      <Button onClick={() => addNewQuestion()} className="w-full">Add</Button>

      {questionsMap.size > 0 &&
        <form action={onSubmitEditor}>
          <Button className="w-full">Save</Button>
        </form>}
    </>
  )
}

export default function QuestionGroupEditor({ questionGroup, saveGroupAction }: QuestionGroupEditorProps) {
  return (
    <>
      <QuestionsEditorProvider value={questionGroup}>
        <_QuestionGroupEditor saveGroupAction={saveGroupAction} />
      </QuestionsEditorProvider>
    </>
  )
}
