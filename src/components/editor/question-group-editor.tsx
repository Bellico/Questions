"use client";

import { QuestionEditorCard } from "@/components/editor/question-editor-card";
import { QuestionsEditorProvider, useQuestionsEditorContext } from "@/components/providers/questions-editor-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/utils";
import { QuestionGroupType } from "@/lib/schema";
import { ActionErrorType, MapToArray } from "@/lib/utils";
import { MailIcon } from "lucide-react";
import { useShallow } from 'zustand/react/shallow';

type QuestionGroupEditorProps = {
  saveGroupAction: (values: QuestionGroupType) => Promise<string | ActionErrorType>;
};

function _QuestionGroupEditor({ saveGroupAction }: QuestionGroupEditorProps) {

  const [groupId, groupName, questionsMap, addNewQuestion, updateName] = useQuestionsEditorContext(
    useShallow((s) => [s.id, s.name, s.questionsMap, s.addNewQuestion, s.updateGroupName]),
  )

  const updateNameDebounced = useDebounce((value) => {
    updateName(value)
  }, 300)

  const onSubmitEditor = () => {
    saveGroupAction({
      id: groupId,
      name: groupName,
      questions: MapToArray(questionsMap)
    })
  }

  console.log('render list')

  return (
    <>
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

export default function QuestionGroupEditor({ saveGroupAction }: QuestionGroupEditorProps) {
  return (
    <>
      <QuestionsEditorProvider>
        <_QuestionGroupEditor saveGroupAction={saveGroupAction} />
      </QuestionsEditorProvider>
    </>
  )
}
