import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface DocViewerProps {
  content: string
}

export default function DocViewer({ content }: DocViewerProps) {
  return (
    <div className="markdown-content doc-viewer">
      <Markdown remarkPlugins={[remarkGfm]}>
        {content}
      </Markdown>
    </div>
  )
}
