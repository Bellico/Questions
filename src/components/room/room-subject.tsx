import { cn } from '@/lib/utils'
import { MDXEditorMethods } from '@mdxeditor/editor'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

const QReaderMarkdown = dynamic(() => import('../../lib/mdx-markdown-reader'), {
  ssr: false
})

export function RoomSubject({ title, subject, order} : { title : string | null, subject : string, order: number}) {

  const qEditorMarkdownRef = useRef<MDXEditorMethods>(null)
  const shouldCenterSubject = !subject.includes('\n')

  useEffect(() => {
    qEditorMarkdownRef.current?.setMarkdown(subject)
  },[subject])

  return(
    <>
      {title && <h1 className="text-center text-2xl font-medium sm:text-5xl">{title}</h1>}
      {!title && <h1 className="text-center text-2xl font-medium sm:text-5xl">Question {order}</h1>}

      <div className={cn('m-5',{ 'text-center': shouldCenterSubject})}>
        <QReaderMarkdown editorRef={qEditorMarkdownRef} markdown={subject}  />
      </div>
    </>
  )
}

