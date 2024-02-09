import { useRoomContext } from '@/components/providers/room-provider'
import { cn } from '@/lib/utils'
import { MDXEditorMethods } from '@mdxeditor/editor'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

const QReaderMarkdown = dynamic(() => import('../../lib/mdx-markdown-reader'), {
  ssr: false
})

export function RoomSubject() {
  const currentQuestion = useRoomContext(state => state.currentQuestion)

  const qEditorMarkdownRef = useRef<MDXEditorMethods>(null)
  const shouldCenterSubject = !currentQuestion.subject.includes('\n')

  useEffect(() => {
    qEditorMarkdownRef.current?.setMarkdown(currentQuestion.subject)
  },[currentQuestion.subject])

  return(
    <>
      {currentQuestion.title && <h1 className="title">{currentQuestion.title}</h1>}
      {!currentQuestion.title && <h1 className="title">Question {currentQuestion.order}</h1>}

      <div className={cn({'text-center': shouldCenterSubject})}>
        <QReaderMarkdown editorRef={qEditorMarkdownRef} markdown={currentQuestion.subject}  />
      </div>
    </>
  )
}

