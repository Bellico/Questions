import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { PropsWithChildren } from 'react'

type QuestionsEditorAccordionHeaderProps = PropsWithChildren<{
  keyMap: string
  title: string | null
  index: number
  responseCount: number,
}>

export function QuestionsEditorAccordionHeader( {
  keyMap,
  index,
  title,
  responseCount,
  children
} : QuestionsEditorAccordionHeaderProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: keyMap})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className="cursor-default border-t-2 border-solid bg-accent py-4 font-medium"
      ref={setNodeRef} style={style} {...attributes}>

      <div className="container flex items-center justify-between">
        <div>
          <GripVertical className="inline-block h-full" {...listeners} />
          <span className="mr-1">Question {index}</span>
          {title && <span className="hidden: mr-1 hidden text-xs sm:inline">({title})</span>}
          <span className="text-second hidden text-xs sm:inline"> - {responseCount} response(s)</span>
        </div>

        <div className="text-right">
          {children}
        </div>
      </div>

      <div className="container sm:hidden">
        {title && <span className="mr-1 text-xs">({title})</span>}
        <span className="text-second text-xs"> - {responseCount} response(s)</span>
      </div>
    </div>
  )
}
