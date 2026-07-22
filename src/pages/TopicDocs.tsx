import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getDocsInTopic, deleteTopic, deleteDoc, createDoc, renameDoc, renameTopic, getLastCommitDate } from '../lib/github'
import { useTopics } from '../App'
import { useToast } from '../components/Toast'
import type { DocSummary } from '../types'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function TopicDocs() {
  const { topicName } = useParams<{ topicName: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { removeTopic, renameTopicInContext, loadTopics } = useTopics()
  const [docs, setDocs] = useState<DocSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteDocTarget, setDeleteDocTarget] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [renameTopicOpen, setRenameTopicOpen] = useState(false)
  const [newTopicName, setNewTopicName] = useState('')
  const [renamingTopic, setRenamingTopic] = useState(false)
  const [renameDocTarget, setRenameDocTarget] = useState<string | null>(null)
  const [newDocName, setNewDocName] = useState('')
  const [renamingDoc, setRenamingDoc] = useState(false)
  const [docDates, setDocDates] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!topicName) return
    setLoading(true)
    loadDocs()
  }, [topicName])

  async function loadDocs() {
    if (!topicName) return
    const result = await getDocsInTopic(`topicos/${topicName}`)
    setDocs(result)
    setLoading(false)

    const dates: Record<string, string> = {}
    for (const d of result) {
      const date = await getLastCommitDate(d.path)
      if (date) dates[d.name] = date
    }
    setDocDates(dates)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f || !topicName) return
    if (!f.name.endsWith('.md')) { addToast('Apenas arquivos .md', 'error'); return }

    setUploading(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const content = ev.target?.result as string || ''
      const fileName = f.name.replace(/\.md$/i, '') + '.md'
      const name = fileName.replace(/\.md$/i, '')
      const ok = await createDoc(`topicos/${topicName}`, fileName, content)
      setUploading(false)
      if (ok) {
        addToast(`"${fileName}" enviado!`, 'success')
        setDocs(prev => [...prev, { name: fileName, path: `topicos/${topicName}/${fileName}`, title: name.replace(/^\d+-/, '').replace(/-/g, ' ') }])
      } else { addToast('Erro ao enviar documento', 'error') }
    }
    reader.readAsText(f)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDeleteTopic() {
    if (!topicName) return
    setDeleting(true)
    const result = await deleteTopic(topicName)
    setDeleting(false); setShowConfirm(false)
    if (result.ok) { removeTopic(topicName); addToast('Tópico deletado!', 'success'); navigate('/') }
    else { addToast('Erro: ' + (result.error || 'Erro ao deletar tópico'), 'error') }
  }

  async function handleDeleteDoc(docName: string) {
    if (!topicName) return
    const result = await deleteDoc(`topicos/${topicName}/${docName}`)
    setDeleteDocTarget(null)
    if (result.ok) { addToast('Documento deletado!', 'success'); setDocs(prev => prev.filter(d => d.name !== docName)) }
    else { addToast('Erro: ' + (result.error || 'Erro ao deletar documento'), 'error') }
  }

  function openRenameTopic() {
    setNewTopicName(topicName || '')
    setRenameTopicOpen(true)
  }

  async function handleRenameTopic() {
    if (!topicName || !newTopicName.trim()) return
    const sanitized = newTopicName.replace(/\s+/g, '-').replace(/[^\p{L}\p{N}\s\-_.+]/gu, '')
    if (!sanitized || sanitized === topicName) { setRenameTopicOpen(false); return }
    setRenameTopicOpen(false)
    addToast('Renomeando...', 'success')
    const result = await renameTopic(topicName, sanitized)
    if (result.ok) {
      renameTopicInContext(topicName, sanitized)
      navigate(`/topico/${encodeURIComponent(sanitized)}`)
    } else {
      addToast('Erro: ' + (result.error || 'Erro ao renomear'), 'error')
    }
  }

  function openRenameDoc(docName: string) {
    setNewDocName(docName.replace(/\.md$/i, '').replace(/-/g, ' '))
    setRenameDocTarget(docName)
  }

  async function handleRenameDoc() {
    if (!topicName || !renameDocTarget || !newDocName.trim()) return
    const sanitized = newDocName.replace(/\s+/g, '-').replace(/[^\p{L}\p{N}\s\-_.+]/gu, '')
    if (!sanitized) return

    const oldName = renameDocTarget
    const newFileName = sanitized + '.md'
    const newTitle = sanitized.replace(/^\d+-/, '').replace(/-/g, ' ')

    setDocs(prev => prev.map(d => d.name === oldName ? { ...d, name: newFileName, title: newTitle, path: `topicos/${topicName}/${newFileName}` } : d))
    setRenameDocTarget(null)
    addToast('Renomeando...', 'success')

    const result = await renameDoc(`topicos/${topicName}`, oldName, newFileName)
    if (!result.ok) {
      setDocs(prev => prev.map(d => d.name === newFileName ? { ...d, name: oldName, title: oldName.replace(/\.md$/i, '').replace(/-/g, ' '), path: `topicos/${topicName}/${oldName}` } : d))
      addToast('Erro: ' + (result.error || 'Erro ao renomear'), 'error')
    }
  }

  if (loading) return <div className="loading">Carregando documentos...</div>

  return (
    <div>
      <div className="page-header">
        <h1>{topicName?.replace(/-/g, ' ')}</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={openRenameTopic}>Renomear</button>
          <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>Deletar</button>
          <input ref={fileInputRef} type="file" accept=".md" onChange={handleFileUpload} style={{ display: 'none' }} />
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? 'Enviando...' : 'Upload .md'}
          </button>
          <Link to={`/topico/${encodeURIComponent(topicName || '')}/novo-doc`} className="btn btn-primary">+ Novo</Link>
        </div>
      </div>

      {docs.length === 0 ? (
        <div className="empty-state">
          <h2>Nenhum documento neste tópico</h2>
          <p>Crie o primeiro documento clicando em "Novo Documento".</p>
        </div>
      ) : (
        <div className="doc-list">
          {docs.map(doc => (
            <div key={doc.path} style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <Link to={`/topico/${encodeURIComponent(topicName || '')}/${encodeURIComponent(doc.name)}`}
                className="doc-item" style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                <span className="doc-title">{doc.title}</span>
                {docDates[doc.name] && <span style={{ fontSize: 11, color: '#7a7298' }}>{formatDate(docDates[doc.name])}</span>}
              </Link>
              <button className="btn btn-secondary" style={{ padding: '0 10px', fontSize: 12 }} onClick={() => openRenameDoc(doc.name)} title="Renomear">✎</button>
              <button className="btn btn-danger" style={{ padding: '0 10px', fontSize: 12 }} onClick={() => setDeleteDocTarget(doc.name)} title="Deletar">X</button>
            </div>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay" onClick={() => !deleting && setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Deletar tópico?</h2>
            <p style={{ color: '#a59ec0', fontSize: 14, marginBottom: 16 }}>
              Tem certeza que deseja deletar <strong>{topicName}</strong> e todos os seus documentos?
            </p>
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)} disabled={deleting}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDeleteTopic} disabled={deleting}>
                {deleting ? 'Deletando...' : 'Sim, deletar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDocTarget && (
        <div className="modal-overlay" onClick={() => setDeleteDocTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Deletar documento?</h2>
            <p style={{ color: '#a59ec0', fontSize: 14, marginBottom: 16 }}>
              Tem certeza que deseja deletar <strong>{deleteDocTarget}</strong>?
            </p>
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => setDeleteDocTarget(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDeleteDoc(deleteDocTarget)}>Sim, deletar</button>
            </div>
          </div>
        </div>
      )}

      {renameTopicOpen && (
        <div className="modal-overlay" onClick={() => !renamingTopic && setRenameTopicOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Renomear tópico</h2>
            <div className="form-group">
              <label>Novo nome</label>
              <input type="text" value={newTopicName} onChange={e => setNewTopicName(e.target.value)} autoFocus />
            </div>
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => setRenameTopicOpen(false)} disabled={renamingTopic}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleRenameTopic} disabled={renamingTopic || !newTopicName.trim()}>
                {renamingTopic ? 'Renomeando...' : 'Renomear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {renameDocTarget && (
        <div className="modal-overlay" onClick={() => !renamingDoc && setRenameDocTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Renomear documento</h2>
            <div className="form-group">
              <label>Novo nome</label>
              <input type="text" value={newDocName} onChange={e => setNewDocName(e.target.value)} autoFocus />
            </div>
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => setRenameDocTarget(null)} disabled={renamingDoc}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleRenameDoc} disabled={renamingDoc || !newDocName.trim()}>
                {renamingDoc ? 'Renomeando...' : 'Renomear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
