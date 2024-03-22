'use client'

import { createQuestionGroupAction } from '@/actions/editor/create-question-group-action'
import { useAction } from '@/hooks/useAction'
import { cn } from '@/lib/utils'
import { FileUp } from 'lucide-react'
import Link from 'next/link'
import { PropsWithChildren, useState } from 'react'

export function QuestionGroupNew({className, children} : PropsWithChildren<{className? : string}>) {
  const [fileEnter, setFileEnter] = useState(false)
  const requestAction = useAction()

  const onDrop = async (groupName : string, questions: any) => {
    requestAction(
      () => createQuestionGroupAction({
        id: null,
        name: groupName,
        questions: questions
      }),
      () => {},
      'Group imported!'
    )
  }

  return (
    <div className={cn(className, 'rounded-lg border-2 border-dashed border-gray-300 hover:border-solid dark:border-gray-700/65',{
      'border-solid border-4 border-primary dark:border-primary p-2': fileEnter
    })}
    onDragOver={(e) => {
      e.preventDefault()
      setFileEnter(Array.from(e.dataTransfer.items).some((i => i .kind === 'file')))
    }}
    onDragLeave={(e) => {
      e.preventDefault()
      setFileEnter(false)
    }}
    onDragEnd={(e) => {
      e.preventDefault()
      setFileEnter(false)
    }}
    onDrop={(e) => {
      e.preventDefault()
      setFileEnter(false)

      Array.from(e.dataTransfer.items)
        .filter((i => i.kind === 'file' && i.type === 'application/json'))
        .forEach(async (item) => {
          const fileObject = item.getAsFile()
          const txt = await fileObject?.text()
          if(!txt) return

          const data = JSON.parse(txt)
          onDrop(data.name, data.questions)
        })
    }}
    >
      <Link href="/editor">
        <div className="pointer-events-none flex h-full items-center justify-center text-sm text-gray-400">
          { fileEnter ? <FileUp className="scale-150 animate-scaleUp text-primary" /> : children }
        </div>
      </Link>
    </div>
  )
}
