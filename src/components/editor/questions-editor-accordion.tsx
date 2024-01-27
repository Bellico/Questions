import { QuestionsEditorSection } from '@/components/editor/questions-editor-section'
import { useQuestionsEditorContext } from '@/components/providers/questions-editor-provider'
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useAccordionState } from '@/hooks/useAccordionState'
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function QuestionsEditorAccordion() {

  const questionsMap = useQuestionsEditorContext(state => state.questionsMap)
  const lastQuestionAdded = useQuestionsEditorContext(state => state.lastQuestionAdded)
  const addNewQuestion = useQuestionsEditorContext(state => state.addQuestion)
  const removeQuestion = useQuestionsEditorContext(state => state.removeQuestion)

  const [accordionState, toggleExpand, expandAll, collapseAll] = useAccordionState(questionsMap, lastQuestionAdded)

  // Strange ! ->  https://nextjs.org/docs/messages/react-hydration-error
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  console.log('render list')

  let index = 1
  return (
    <>
      <Accordion type="multiple" value={accordionState}>
        {[...questionsMap].map(([key, value]) => (
          <AccordionItem key={key} id={'q-' + key} value={key}>

            <div className="cursor-default border-t-2 border-solid bg-accent py-4 font-medium">
              <div className="container flex items-center">
                <div>
                  <span className="mr-1">Question {index}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400"> - {value.responses.length} response(s)</span>
                </div>
                {isClient &&
                  <div className="flex-1 text-right">
                    {questionsMap.size > 1 && <Button className="mr-2" variant="destructive" onClick={() => removeQuestion(key)}>Remove</Button>}
                    <Button className="mr-2" variant="outline" onClick={() => toggleExpand(key)}>{accordionState.includes(key) ? 'Hide' : 'Show'}</Button>
                    <Button className="mr-2 hidden md:inline" variant="ghost" onClick={() => expandAll()}><ChevronsUpDown className="size-3" /></Button>
                    <Button variant="ghost" onClick={() => collapseAll()}><ChevronsDownUp className="size-3" /></Button>
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
