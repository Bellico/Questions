'use client'

import dynamic from 'next/dynamic'

export const QEditorMarkdown = dynamic(() => import('../../lib/initializedMDXEditor'), {
  ssr: false
})
