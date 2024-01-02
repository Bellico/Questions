"use client";

import { QuestionEditorCard } from "@/components/editor/question-editor-card";
import { QuestionsEditorProvider, useQuestionsEditorContext } from "@/components/providers/questions-editor-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuestionGroupType } from "@/lib/schema";
import { ActionErrorType } from "@/lib/utils";
import { MailIcon } from "lucide-react";
import { useShallow } from 'zustand/react/shallow';

type QuestionGroupEditorProps = {
  onSubmit: (values: QuestionGroupType) => Promise<string | ActionErrorType>;
};

function _QuestionGroupEditor({ onSubmit }: QuestionGroupEditorProps) {

  const [groupId, groupName, questions, addNewQuestion] = useQuestionsEditorContext(
    useShallow((s) => [s.id, s.name, s.getArrayQuestions(), s.addNewQuestion]),
  )

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
        />
      </label>

      {questions.map(q => <QuestionEditorCard key={q.id} id={q.id} subject={q.subject} responses={q.responses} />)}

      <Button onClick={() => addNewQuestion()} className="w-full">Add</Button>

      <form action={() => onSubmit({
        id: groupId,
        name: groupName,
        questions: questions
      })}>
        <Button className="w-full">Save</Button>
      </form>
    </>
  )
}


export default function QuestionGroupEditor({ onSubmit }: QuestionGroupEditorProps) {
  return (
    <>
      <QuestionsEditorProvider>
        <_QuestionGroupEditor onSubmit={onSubmit} />
      </QuestionsEditorProvider>
    </>
  )
}
