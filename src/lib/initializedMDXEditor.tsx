import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CodeToggle,
    InsertTable,
    ListsToggle,
    MDXEditor,
    codeBlockPlugin,
    frontmatterPlugin,
    headingsPlugin,
    listsPlugin,
    markdownShortcutPlugin,
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
            </>)
    }),
    listsPlugin(),
    quotePlugin(),
    headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
    // linkPlugin(),
    // imagePlugin({
    //     imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    //     imageUploadHandler: async () => Promise.resolve('https://picsum.photos/200/300')
    // }),
    tablePlugin(),
    thematicBreakPlugin(),
    frontmatterPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
    // codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
    markdownShortcutPlugin()
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
