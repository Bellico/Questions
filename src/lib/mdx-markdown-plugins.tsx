import {
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin
} from '@mdxeditor/editor'

export const PLUGINS_MDX = [
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  tablePlugin(),
  thematicBreakPlugin(),
  imagePlugin({
    imageUploadHandler: async (image: File) => {
      const formData = new FormData()
      formData.append('image', image)

      const options = {
        method: 'POST',
        body: formData,
      }

      const result = await fetch('/api/upload', options)
      const res = await result.json()

      return res.url
    }
  }),
]
