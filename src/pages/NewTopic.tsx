import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTopic, createDoc } from '../lib/github'
import { useTopics } from '../App'
import { useToast } from '../components/Toast'

export default function NewTopic() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { addTopic } = useTopics()

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.endsWith('.md')) {
      setError('Apenas arquivos .md')
      return
    }
    setFile(f)
    setError('')
    if (!name.trim()) {
      setName(f.name.replace(/\.md$/i, '').replace(/\s+/g, '-').replace(/[^\p{L}\p{N}\s\-_.+]/gu, ''))
    }
    const reader = new FileReader()
    reader.onload = (ev) => setFileContent(ev.target?.result as string || '')
    reader.readAsText(f)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const topicName = name.replace(/\s+/g, '-').replace(/[^\p{L}\p{N}\s\-_.+]/gu, '')
    if (!topicName) {
      setError('Nome inválido')
      return
    }

    setLoading(true)
    try {
      const ok = await createTopic(topicName)
      if (!ok) {
        setError('Erro ao criar tópico no GitHub')
        setLoading(false)
        return
      }

      if (file && fileContent) {
        const fileName = file.name.replace(/\.md$/i, '') + '.md'
        const docOk = await createDoc(`topicos/${topicName}`, fileName, fileContent)
        if (!docOk) {
          setError('Erro ao enviar documento')
          setLoading(false)
          return
        }
        addTopic(topicName)
        addToast(`"${topicName}" criado com documento!`, 'success')
        navigate(`/topico/${encodeURIComponent(topicName)}/${encodeURIComponent(fileName)}`)
      } else {
        addTopic(topicName)
        addToast(`Tópico "${topicName}" criado!`, 'success')
        navigate(`/topico/${encodeURIComponent(topicName)}`)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Novo Tópico</h1>

      <div style={{ background: '#120e1a', border: '1px solid #2a1f3d', borderRadius: 12, padding: 24 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do tópico</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: React, Node.js, Git..."
              required
            />
            <div style={{ color: '#7a7298', fontSize: 12, marginTop: 4 }}>
              {name ? `→ ${name.replace(/\s+/g, '-').replace(/[^\p{L}\p{N}\s\-_.+]/gu, '')}` : ''}
            </div>
          </div>

          <div className="form-group">
            <label>Upload .md (opcional)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md"
              onChange={handleFileSelect}
              style={{ padding: 8, fontSize: 13 }}
            />
            {file && (
              <div style={{ color: '#7a7298', fontSize: 12, marginTop: 4 }}>
                {file.name} — {fileContent.length} caracteres
              </div>
            )}
          </div>

          {error && <div style={{ color: '#f85149', fontSize: 14, marginBottom: 16 }}>{error}</div>}

          <div className="btn-row" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
              {loading ? 'Criando...' : file ? 'Criar com Documento' : 'Criar Tópico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
