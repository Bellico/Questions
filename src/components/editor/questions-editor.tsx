"use client";

import { QuestionsEditorActions } from "@/components/editor/questions-editor-actions";
import { QuestionsEditorHeader } from "@/components/editor/questions-editor-header";
import { QuestionsEditorSection } from "@/components/editor/questions-editor-section";
import { QuestionsEditorProvider, useQuestionsEditorContext } from "@/components/providers/questions-editor-provider";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAccordionState } from "@/hooks/useAccordionState";
import { QuestionGroupType } from "@/lib/schema";
import { ActionResultType } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from 'zustand/react/shallow';

type QuestionsEditorProps = {
  questionGroup?: QuestionGroupType,
  saveGroupAction: (values: QuestionGroupType) => Promise<ActionResultType<string | void>>;
}

function _QuestionsEditor({ saveGroupAction }: QuestionsEditorProps) {

  const [questionsMap, lastQuestionAdded, addNewQuestion, removeQuestion] = useQuestionsEditorContext(
    useShallow((s) => [s.questionsMap, s.lastQuestionAdded, s.addQuestion, s.removeQuestion]),
  )

  const [accordionState, toggleExpand, expandAll, collapseAll] = useAccordionState(questionsMap, lastQuestionAdded)

  // Strange ! ->  https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  let index = 1;
  return (
    <>
      <div className="container">
        <QuestionsEditorActions saveGroupAction={saveGroupAction} />
        <QuestionsEditorHeader />
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
                    {questionsMap.size > 1 && <Button className="mr-2 text-xs md:text-sm" variant="destructive" onClick={() => removeQuestion(key)}>Remove</Button>}
                    <Button className="mr-2 text-xs md:text-sm" variant="outline" onClick={() => toggleExpand(key)}>{accordionState.includes(key) ? 'Hide' : 'Show'}</Button>
                    <Button className="mr-2 hidden md:inline" variant="ghost" onClick={() => expandAll()}><ChevronsUpDown className="h-3 w-3" /></Button>
                    <Button variant="ghost" onClick={() => collapseAll()}><ChevronsDownUp className="h-3 w-3" /></Button>
                  </div>}
              </div>
            </div>

            <AccordionContent>
              <QuestionsEditorSection keyMap={key} indexQuestion={index++} question={value} />
            </AccordionContent>

          </AccordionItem>
        ))}
      </Accordion>

      <Button variant="secondary" onClick={() => addNewQuestion()} className="w-full">Add new question</Button>
    </>
  )
}

export default function QuestionsEditor({ questionGroup, saveGroupAction }: QuestionsEditorProps) {
  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}>
        <QuestionsEditorProvider value={questionGroup}>
          <_QuestionsEditor saveGroupAction={saveGroupAction} />
        </QuestionsEditorProvider>
      </motion.div>
    </>
  )
}
