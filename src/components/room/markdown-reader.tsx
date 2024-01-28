'use client'

import {
  MDXEditor,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin
} from '@mdxeditor/editor'

export const PLUGINS = [
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin({
    imageAutocompleteSuggestions: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    imageUploadHandler: async () =>
      Promise.resolve('https://picsum.photos/200/300'),
  }),
  tablePlugin(),
  thematicBreakPlugin(),
]

const MarkdownReader = () => {
  return (
    <MDXEditor
      markdown={'# Hello nworld'}
      readOnly={true}
      contentEditableClassName="q-editor-markdown"
      plugins={PLUGINS}
    />
  )
}

export default MarkdownReader
