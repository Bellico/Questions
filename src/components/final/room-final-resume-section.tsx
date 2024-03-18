import { getRoomFinalResumeQuery } from '@/actions/queries'
import { ArrayType, cn } from '@/lib/utils'
import { CheckCheck, XCircle } from 'lucide-react'
import dynamic from 'next/dynamic'

const QReaderMarkdown = dynamic(() => import('../mdx/mdx-markdown-reader'), {
  ssr: false
})

type RoomFinalResumeSectionPropsType = ArrayType<Awaited<ReturnType<typeof getRoomFinalResumeQuery>>>

export function RoomFinalResumeSection({answerResume} : { answerResume: RoomFinalResumeSectionPropsType }) {

  if(answerResume.question == null){
    return(
      <section className="py-24 shadow-inner even:bg-accent">
        <div className="container text-center">
          <h1 className="title flex flex-col items-center justify-center">
            <span>Question {answerResume.order}</span>
            {answerResume.achievement == 100  && <CheckCheck className="mt-2 size-11 text-success" />}
            {answerResume.achievement! < 100  && <XCircle className="mt-2 size-11 text-destructive" />}
          </h1>
          <h2 className="text-second">This question has been deleted</h2>
        </div>
      </section>
    )
  }

  const choices = answerResume.choices.map(c => c.responseId)

  return(
    <section className="py-36 shadow-inner even:bg-accent">
      <div className="container flex flex-col lg:flex-row">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="title flex flex-col items-center justify-center">
            <span>{answerResume.question?.title || `Question ${answerResume.order}`}</span>
            {answerResume.achievement == 100  && <CheckCheck className="mt-2 size-11 text-success" />}
            {answerResume.achievement! < 100  && <XCircle className="mt-2 size-11 text-destructive" />}
          </h1>
          <QReaderMarkdown markdown={answerResume.question?.subject!}  />
        </div>
        <div className="flex-1">
          {answerResume.question?.responses.map(response => (
            <div key={response.id} className={cn('m-3 border border-gray-200 dark:border-secondary p-5 shadow-lg rounded-xl', {
              '!border-destructive line-through text-destructive': !response.isCorrect && choices.includes(response.id),
              'border-success bg-success': response.isCorrect && choices.includes(response.id),
              '!border-success border-dashed border-2': response.isCorrect && !choices.includes(response.id),
              'text-foreground/30': !response.isCorrect && !choices.includes(response.id)
            })}>
              <p>{response.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
