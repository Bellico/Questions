'use client'

import { PLUGINS_MDX } from '@/lib/mdx-markdown-plugins'
import {
  MDXEditor, MDXEditorMethods
} from '@mdxeditor/editor'
import { ForwardedRef } from 'react'

export default function MarkdownReader({
  editorRef,
  markdown
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & { markdown : string}) {
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      readOnly={true}
      contentEditableClassName="q-editor-markdown"
      plugins={PLUGINS_MDX}
    />
  )
}

