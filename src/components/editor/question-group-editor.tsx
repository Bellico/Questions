"use client";

import { QuestionEditorCard } from "@/components/editor/question-editor-card";
import { QuestionsEditorProvider, useQuestionsEditorContext } from "@/components/providers/questions-editor-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/utils";
import { QuestionGroupType } from "@/lib/schema";
import { ActionErrorType, mapToArray } from "@/lib/utils";
import { Mail, MailIcon } from "lucide-react";
import Link from "next/link";
import { useShallow } from 'zustand/react/shallow';

type QuestionGroupEditorProps = {
  questionGroup?: QuestionGroupType,
  saveGroupAction: (values: QuestionGroupType) => Promise<string | boolean | ActionErrorType>;
};

function _QuestionGroupEditor({ saveGroupAction }: QuestionGroupEditorProps) {

  const [groupId, groupName, questionsMap, addNewQuestion, updateName] = useQuestionsEditorContext(
    useShallow((s) => [s.id, s.name, s.questionsMap, s.addNewQuestion, s.updateGroupName]),
  )

  const updateNameDebounced = useDebounce((value) => {
    updateName(value)
  }, 300)

  const onSubmitEditor = async () => {
    const result = await saveGroupAction({
      id: groupId,
      name: groupName,
      questions: mapToArray(questionsMap)
    })

    console.log('Saved', result)
  }

  console.log('render list')

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

      {[...questionsMap].map(([key, value]) => <QuestionEditorCard key={key} keyMap={key} question={value} />)}

      <Button onClick={() => addNewQuestion()} className="w-full">Add</Button>

      <form action={onSubmitEditor}>
        <Button className="w-full">Save</Button>
      </form>
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
