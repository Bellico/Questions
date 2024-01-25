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
    type MDXEditorProps
} from '@mdxeditor/editor'
import type { ForwardedRef } from 'react'

const PLUGINS = [
    toolbarPlugin({
        toolbarContents: () => (
            <>
                {' '}
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <ListsToggle />
                <BlockTypeSelect />
                <InsertTable />
                <InsertThematicBreak />
            </>)
    }),
    listsPlugin(),
    quotePlugin(),
    headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
    tablePlugin(),
    thematicBreakPlugin()
]

export default function InitializedMDXEditor({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    return (
        <MDXEditor
            plugins={PLUGINS}
            contentEditableClassName='q-editor-markdown'
            ref={editorRef}
            {...props}
        />
    )
}
