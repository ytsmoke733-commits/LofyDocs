import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createDoc } from '../lib/github'
import { useToast } from '../components/Toast'

export default function NewDoc() {
  const { topicName } = useParams<{ topicName: string }>()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { addToast } = useToast()

  const fileName = title.replace(/\s+/g, '-').replace(/[^\p{L}\p{N}\s\-_.+]/gu, '') + '.md'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!topicName) {
      setError('Tópico não encontrado')
      return
    }

    setLoading(true)
    try {
      const ok = await createDoc(`topicos/${topicName}`, fileName, content || `# ${title}\n\nEscreva sua documentação aqui...`)
      if (ok) {
        addToast('Documento criado!', 'success')
        navigate(`/topico/${encodeURIComponent(topicName)}/${encodeURIComponent(fileName)}`)
      } else {
        setError('Erro ao criar documento. Verifique se o token tem permissão.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1>Novo Documento em {topicName?.replace(/-/g, ' ')}</h1>

      <div style={{ background: '#120e1a', border: '1px solid #2a1f3d', borderRadius: 12, padding: 24 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título do documento"
              required
            />
            <div style={{ color: '#7a7298', fontSize: 12, marginTop: 4 }}>
              Arquivo: {fileName || '...'}
            </div>
          </div>

          <div className="form-group">
            <label>Conteúdo (Markdown)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="# Titulo&#10;&#10;Escreva sua documentação em Markdown aqui..."
              style={{ minHeight: 300 }}
            />
          </div>

          {error && <div style={{ color: '#f85149', fontSize: 14, marginBottom: 16 }}>{error}</div>}

          <div className="btn-row" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
              {loading ? 'Criando...' : 'Criar Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
