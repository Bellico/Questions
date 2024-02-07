import dynamic from 'next/dynamic'

const QReaderMarkdown = dynamic(() => import('../../lib/mdx-markdown-reader'), {
  ssr: false
})

export function RoomProgress() {

  return(
    <div className="fixed bottom-0 h-12 w-full animate-fadeIn bg-red-800"></div>
  )
}
