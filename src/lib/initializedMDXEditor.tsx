import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  linkPlugin,
  CreateLink,
  linkDialogPlugin,
  UndoRedo,
} from '@mdxeditor/editor'
import type { ForwardedRef } from 'react'

const PLUGINS = [
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
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  tablePlugin(),
  thematicBreakPlugin(),
]

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={PLUGINS}
      contentEditableClassName="q-editor-markdown"
      ref={editorRef}
      {...props} />
  )
}
