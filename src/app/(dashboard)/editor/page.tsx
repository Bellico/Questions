"use client";

import { AddQuestionButton } from "@/components/editor/add-button";
import { QuestionEditorList } from "@/components/editor/question-editor-list";
import { QuestionsEditorProvider } from "@/components/providers/questions-editor-provider";
import { Input } from "@/components/ui/input";
import { Question } from "@/lib/questions-editor-store";
import { MailIcon } from "lucide-react";

export default function EditorPage() {

  const questions = [
    {
      subject: "quesiton test 1",
      responses: [
        'resposne1',
        'resposne2',
        'resposne3',
      ]
    },
    {
      subject: "quesiton test 2",
      responses: [
        'resposne1',
        'resposne2',
        'resposne3',
      ]
    }
  ] satisfies Question[]

  const questionText = "tot"
  console.log('render page')

  return (
    <>
      <QuestionsEditorProvider prop={{ name: questionText, questions }}>
        <label htmlFor="email" className="relative block w-6/12 m-auto">
          <MailIcon className="w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3" />
          <Input
            className="border-t-0 border-l-0 border-r-0 border-b-1 p-3 text-xl mb-4 text-center"
            id="email"
            placeholder="Enter your text here"
            type="text"
          />
        </label>

        <QuestionEditorList />

        <AddQuestionButton />

      </QuestionsEditorProvider>
    </>
  )
}
