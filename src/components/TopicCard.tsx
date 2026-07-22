import { Link } from 'react-router-dom'
import type { Topic } from '../types'

interface TopicCardProps {
  topic: Topic
  lastCommit?: string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function TopicCard({ topic, lastCommit }: TopicCardProps) {
  return (
    <Link to={`/topico/${encodeURIComponent(topic.name)}`} className="topic-card">
      <h3>{topic.name.replace(/-/g, ' ')}</h3>
      {lastCommit && (
        <div className="topic-count">
          {formatDate(lastCommit)}
        </div>
      )}
    </Link>
  )
}
