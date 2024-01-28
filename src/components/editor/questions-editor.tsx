'use client'

import { QuestionsEditorAccordion } from '@/components/editor/questions-editor-accordion'
import { QuestionsEditorActions } from '@/components/editor/questions-editor-actions'
import { QuestionsEditorHeader } from '@/components/editor/questions-editor-header'
import { QuestionsEditorProvider } from '@/components/providers/questions-editor-provider'
import { QuestionGroupType } from '@/lib/schema'
import { ActionResultType } from '@/lib/utils'

type QuestionsEditorProps = {
  questionGroup?: QuestionGroupType,
  useDraft?: boolean,
  saveGroupAction: (values: QuestionGroupType) => Promise<ActionResultType<string | void>>;
}

export function QuestionsEditor(props: QuestionsEditorProps) {
  return (
    <div className='animate-zoomInEditor'>
      <QuestionsEditorProvider value={props.questionGroup}>
        <div className="container">
          <QuestionsEditorActions {...props} />
          <QuestionsEditorHeader />
        </div>

        <QuestionsEditorAccordion />

      </QuestionsEditorProvider>
    </div>
  )
}
