import { useEffect, useState } from 'react'
import { useTopics } from '../App'
import { getLastCommitDate } from '../lib/github'
import TopicCard from '../components/TopicCard'

export default function Topics() {
  const { topics, loadTopics } = useTopics()
  const [dates, setDates] = useState<Record<string, string>>({})
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      loadTopics()
      setInitialized(true)
    }
  }, [initialized])

  useEffect(() => {
    if (topics.length === 0) { setDates({}); return }
    let cancelled = false
    const fetchDates = async () => {
      const result: Record<string, string> = {}
      for (const t of topics) {
        if (cancelled) return
        const date = await getLastCommitDate(t.path)
        if (date) result[t.name] = date
      }
      if (!cancelled) setDates(result)
    }
    fetchDates()
    return () => { cancelled = true }
  }, [topics])

  return (
    <div>
      <div className="page-header">
        <h1>Tópicos</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => { loadTopics(); setDates({}) }}>
            Atualizar
          </button>
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="empty-state">
          <h2>Nenhum tópico ainda</h2>
          <p>Crie um novo tópico para começar a documentar.</p>
        </div>
      ) : (
        <div className="topic-grid">
          {topics.map(t => (
            <TopicCard key={t.path} topic={t} lastCommit={dates[t.name] || ''} />
          ))}
        </div>
      )}
    </div>
  )
}
