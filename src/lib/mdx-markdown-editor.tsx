'use client'

import { PLUGINS_MDX } from '@/lib/mdx-markdown-plugins'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  toolbarPlugin,
  type MDXEditorMethods,
  type MDXEditorProps
} from '@mdxeditor/editor'
import type { ForwardedRef } from 'react'

export default function MarkdownEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {' '}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <ListsToggle />
              <BlockTypeSelect />
              <CreateLink />
              <InsertTable />
              <InsertThematicBreak />
            </>
          ),
        }),
        ...PLUGINS_MDX]}
      contentEditableClassName="q-editor-markdown"
      ref={editorRef}
      {...props} />
  )
}
