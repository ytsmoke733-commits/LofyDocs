import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDocContent, updateDoc } from '../lib/github'
import { useToast } from '../components/Toast'
import DocViewer from '../components/DocViewer'

export default function DocView() {
  const { topicName, docName } = useParams<{ topicName: string; docName: string }>()
  const { addToast } = useToast()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  const docPath = `topicos/${topicName}/${docName}`

  useEffect(() => {
    if (!topicName || !docName) return
    setLoading(true)
    getDocContent(docPath)
      .then(setContent)
      .catch(() => setContent('# Erro ao carregar documento'))
      .finally(() => setLoading(false))
  }, [topicName, docName])

  function startEdit() {
    setEditContent(content)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setEditContent('')
  }

  async function saveEdit() {
    if (!topicName || !docName) return
    setSaving(true)
    const result = await updateDoc(docPath, editContent)
    if (result.ok) {
      setContent(editContent)
      setEditing(false)
      addToast('Documento salvo com sucesso!', 'success')
    } else {
      addToast('Erro: ' + (result.error || 'Erro ao salvar'), 'error')
    }
    setSaving(false)
  }

  if (loading) return <div className="loading">Carregando documento...</div>

  const title = docName?.replace(/\.md$/, '').replace(/^\d+-/, '').replace(/-/g, ' ') || ''

  return (
    <div className="content-page">
      <div className="page-header">
        <div>
          <Link to={`/topico/${encodeURIComponent(topicName || '')}`} style={{ color: '#7a7298', fontSize: 13 }}>
            ← {topicName?.replace(/-/g, ' ')}
          </Link>
          <h1 style={{ marginTop: 8 }}>{title}</h1>
        </div>
        {!editing && (
          <button className="btn btn-primary" onClick={startEdit}>
            Editar
          </button>
        )}
      </div>

      <div className="doc-meta">
        {topicName}/{docName}
      </div>

      {editing ? (
        <div>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            style={{ width: '100%', minHeight: 400, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.5 }}
          />
          <div className="btn-row" style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={cancelEdit} disabled={saving}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      ) : (
        <DocViewer content={content} />
      )}
    </div>
  )
}
