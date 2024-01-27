'use client'

import { QuestionsEditorAccordion } from '@/components/editor/questions-editor-accordion'
import { QuestionsEditorActions } from '@/components/editor/questions-editor-actions'
import { QuestionsEditorHeader } from '@/components/editor/questions-editor-header'
import { QuestionsEditorProvider } from '@/components/providers/questions-editor-provider'
import { QuestionGroupType } from '@/lib/schema'
import { ActionResultType } from '@/lib/utils'
import { motion } from 'framer-motion'

type QuestionsEditorProps = {
  questionGroup?: QuestionGroupType,
  useDraft?: boolean,
  saveGroupAction: (values: QuestionGroupType) => Promise<ActionResultType<string | void>>;
}

export function QuestionsEditor(props: QuestionsEditorProps) {
  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.75 }}>

        <QuestionsEditorProvider value={props.questionGroup}>
          <div className="container">
            <QuestionsEditorActions {...props} />
            <QuestionsEditorHeader />
          </div>

          <QuestionsEditorAccordion />

        </QuestionsEditorProvider>

      </motion.div>
    </>
  )
}
