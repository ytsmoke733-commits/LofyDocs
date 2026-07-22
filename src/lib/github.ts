import { GitHubContent, Topic, DocSummary } from '../types'

const OWNER = 'ytsmoke733-commits'
const REPO = 'LofyDocs'
const BASE_URL = `https://api.github.com/repos/${OWNER}/${REPO}`
const TOPICS_PATH = 'topicos'

function encPath(path: string): string {
  return path.split('/').map(p => encodeURIComponent(p)).join('/')
}

function getToken(): string | null {
  const token = import.meta.env.VITE_GITHUB_TOKEN || localStorage.getItem('github_token')
  if (!token || token === 'undefined' || token === 'null') return null
  return token
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

function cacheBuster(): string {
  return `_=${Date.now()}`
}

async function safeJsonFetch(url: string, options?: RequestInit): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  try {
    const resp = await fetch(url, options)
    const text = await resp.text()
    if (!text) return { ok: false, error: `GitHub vazio (${resp.status})` }
    try {
      return { ok: true, data: JSON.parse(text) }
    } catch {
      const preview = text.length > 80 ? text.substring(0, 80) + '...' : text
      return { ok: false, error: `GitHub não-JSON (${resp.status}): ${preview}` }
    }
  } catch (err) {
    return { ok: false, error: `Erro de rede: ${err instanceof Error ? err.message : 'desconhecido'}` }
  }
}

export async function getTopics(): Promise<Topic[]> {
  const result = await safeJsonFetch(`${BASE_URL}/contents/${TOPICS_PATH}?${cacheBuster()}`, {
    headers: { Accept: 'application/vnd.github.v3+json', ...authHeaders() },
  })
  if (!result.ok) return []
  const dirs = result.data as GitHubContent[]
  return dirs
    .filter(d => d.type === 'dir')
    .map(dir => ({ name: dir.name, path: dir.path, docs: [] }))
}

export async function getDocsInTopic(topicPath: string): Promise<DocSummary[]> {
  const result = await safeJsonFetch(`${BASE_URL}/contents/${encPath(topicPath)}?${cacheBuster()}`, {
    headers: { Accept: 'application/vnd.github.v3+json', ...authHeaders() },
  })
  if (!result.ok) return []
  const files = result.data as GitHubContent[]
  return files
    .filter(f => f.type === 'file' && f.name.endsWith('.md') && f.name !== '.gitkeep')
    .map(f => ({
      name: f.name,
      path: f.path,
      title: f.name.replace(/\.md$/, '').replace(/^\d+-/, '').replace(/-/g, ' '),
    }))
}

export async function getDocContent(path: string): Promise<string> {
  const resp = await fetch(`${BASE_URL}/contents/${encPath(path)}?${cacheBuster()}`, {
    headers: { Accept: 'application/vnd.github.v3.raw', ...authHeaders() },
  })
  if (!resp.ok) return '# Erro ao carregar documento'
  return await resp.text()
}

export async function createTopic(name: string): Promise<boolean> {
  const token = getToken()
  if (!token) return false

  const resp = await fetch(`${BASE_URL}/contents/${encPath(`${TOPICS_PATH}/${name}/.gitkeep`)}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: `Criar tópico: ${name}`, content: btoa('') }),
  })
  if (!resp.ok) {
    let err = ''
    try { err = await resp.text() } catch {}
    console.error('createTopic error:', resp.status, err)
  }
  return resp.ok
}

export async function createDoc(topicPath: string, fileName: string, content: string): Promise<boolean> {
  const token = getToken()
  if (!token) return false

  const encoded = btoa(unescape(encodeURIComponent(content)))
  const resp = await fetch(`${BASE_URL}/contents/${encPath(`${topicPath}/${fileName}`)}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: `Criar documento: ${fileName}`, content: encoded }),
  })
  return resp.ok
}

export async function updateDoc(path: string, content: string): Promise<{ ok: boolean; error?: string }> {
  const token = getToken()
  if (!token) return { ok: false, error: 'Token do GitHub não configurado' }

  const refResult = await safeJsonFetch(`${BASE_URL}/git/refs/heads/main`, {
    headers: { Accept: 'application/vnd.github.v3+json', Authorization: `Bearer ${token}` },
  })
  if (!refResult.ok) return { ok: false, error: 'Erro ao obter referência: ' + refResult.error }
  const refData = refResult.data as { object: { sha: string } }
  const latestCommitSha = refData.object.sha

  const commitResult = await safeJsonFetch(`${BASE_URL}/git/commits/${latestCommitSha}`, {
    headers: { Accept: 'application/vnd.github.v3+json', Authorization: `Bearer ${token}` },
  })
  if (!commitResult.ok) return { ok: false, error: 'Erro ao obter commit: ' + commitResult.error }
  const commitData = commitResult.data as { tree: { sha: string } }
  const baseTreeSha = commitData.tree.sha

  const blobResult = await safeJsonFetch(`${BASE_URL}/git/blobs`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, encoding: 'utf-8' }),
  })
  if (!blobResult.ok) return { ok: false, error: 'Erro ao criar blob: ' + blobResult.error }
  const blobData = blobResult.data as { sha: string }
  const blobSha = blobData.sha

  const treeResult = await safeJsonFetch(`${BASE_URL}/git/trees`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: [{ path, mode: '100644' as const, type: 'blob' as const, sha: blobSha }],
    }),
  })
  if (!treeResult.ok) return { ok: false, error: 'Erro ao criar tree: ' + treeResult.error }
  const treeData = treeResult.data as { sha: string }

  const newCommitResult = await safeJsonFetch(`${BASE_URL}/git/commits`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Atualizar: ${path}`,
      tree: treeData.sha,
      parents: [latestCommitSha],
    }),
  })
  if (!newCommitResult.ok) return { ok: false, error: 'Erro ao criar commit: ' + newCommitResult.error }
  const newCommitData = newCommitResult.data as { sha: string }

  const updateResult = await safeJsonFetch(`${BASE_URL}/git/refs/heads/main`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sha: newCommitData.sha, force: false }),
  })
  if (!updateResult.ok) return { ok: false, error: 'Erro ao atualizar ref: ' + updateResult.error }
  return { ok: true }
}

export async function getFileSha(path: string): Promise<string | null> {
  const result = await safeJsonFetch(`${BASE_URL}/contents/${encPath(path)}?${cacheBuster()}`, {
    headers: { Accept: 'application/vnd.github.v3+json', ...authHeaders() },
  })
  if (!result.ok) return null
  return (result.data as GitHubContent).sha
}

async function deleteFile(path: string, sha: string): Promise<{ ok: boolean; error?: string }> {
  const token = getToken()
  if (!token) return { ok: false, error: 'Token do GitHub não configurado' }

  const resp = await fetch(`${BASE_URL}/contents/${encPath(path)}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: `Deletar: ${path}`, sha }),
  })
  if (!resp.ok) {
    let err = ''
    try { err = await resp.text() } catch {}
    return { ok: false, error: `GitHub API: ${resp.status} - ${err}` }
  }
  return { ok: true }
}

export async function deleteTopic(topicName: string): Promise<{ ok: boolean; error?: string }> {
  const dirPath = `${TOPICS_PATH}/${topicName}`
  const token = getToken()
  if (!token) return { ok: false, error: 'Token do GitHub não configurado' }

  const result = await safeJsonFetch(`${BASE_URL}/contents/${encPath(dirPath)}?${cacheBuster()}`, {
    headers: { Accept: 'application/vnd.github.v3+json', Authorization: `Bearer ${token}` },
  })
  if (!result.ok) return { ok: false, error: 'Tópico não encontrado: ' + result.error }

  const items = result.data as GitHubContent[]
  for (const item of items) {
    if (item.type === 'file') {
      const r = await deleteFile(item.path, item.sha)
      if (!r.ok) return r
    } else if (item.type === 'dir') {
      const r = await deleteTopic(item.path.replace(`${TOPICS_PATH}/`, ''))
      if (!r.ok) return r
    }
  }
  return { ok: true }
}

export async function deleteDoc(path: string): Promise<{ ok: boolean; error?: string }> {
  const sha = await getFileSha(path)
  if (!sha) return { ok: false, error: 'Arquivo não encontrado no GitHub' }
  return deleteFile(path, sha)
}

export async function getLastCommitDate(path: string): Promise<string | null> {
  const result = await safeJsonFetch(
    `${BASE_URL}/commits?path=${encodeURIComponent(path)}&per_page=1&sha=main`,
    { headers: { Accept: 'application/vnd.github.v3+json', ...authHeaders() } },
  )
  if (!result.ok) return null
  const data = result.data as Array<{ commit: { committer?: { date: string }; author?: { date: string } } }>
  if (!data || data.length === 0) return null
  return data[0].commit?.committer?.date || data[0].commit?.author?.date || null
}

export async function renameDoc(
  topicPath: string,
  oldName: string,
  newName: string
): Promise<{ ok: boolean; error?: string }> {
  const token = getToken()
  if (!token) return { ok: false, error: 'Token do GitHub não configurado' }

  const oldPath = `${topicPath}/${oldName}`
  const newFileName = newName.endsWith('.md') ? newName : newName + '.md'
  const newPath = `${topicPath}/${newFileName}`

  const result = await safeJsonFetch(`${BASE_URL}/contents/${encPath(oldPath)}?${cacheBuster()}`, {
    headers: { Accept: 'application/vnd.github.v3+json', Authorization: `Bearer ${token}` },
  })
  if (!result.ok) return { ok: false, error: 'Arquivo original não encontrado: ' + result.error }
  const oldData = result.data as GitHubContent

  const createResp = await fetch(`${BASE_URL}/contents/${encPath(newPath)}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Renomear: ${oldName} → ${newFileName}`,
      content: oldData.content,
    }),
  })
  if (!createResp.ok) return { ok: false, error: 'Erro ao criar novo arquivo' }

  return deleteFile(oldPath, oldData.sha)
}

export async function renameTopic(
  oldName: string,
  newName: string
): Promise<{ ok: boolean; error?: string }> {
  const token = getToken()
  if (!token) return { ok: false, error: 'Token do GitHub não configurado' }

  const oldDir = `${TOPICS_PATH}/${oldName}`
  const newDir = `${TOPICS_PATH}/${newName}`

  const listResult = await safeJsonFetch(`${BASE_URL}/contents/${encPath(oldDir)}?${cacheBuster()}`, {
    headers: { Accept: 'application/vnd.github.v3+json', Authorization: `Bearer ${token}` },
  })
  if (!listResult.ok) return { ok: false, error: 'Tópico original não encontrado: ' + listResult.error }

  const items = listResult.data as GitHubContent[]
  const files = items.filter(i => i.type === 'file' && i.name !== '.gitkeep')

  for (const file of files) {
    const content = await getDocContent(file.path)
    const newPath = file.path.replace(oldDir, newDir)
    const encoded = btoa(unescape(encodeURIComponent(content)))

    const createResp = await fetch(`${BASE_URL}/contents/${encPath(newPath)}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Renomear tópico: ${oldName} → ${newName}`,
        content: encoded,
      }),
    })
    if (!createResp.ok) {
      let err = ''
      try { err = await createResp.text() } catch {}
      return { ok: false, error: `Erro ao criar ${newPath}: ${createResp.status} ${err}` }
    }

    const delResult = await deleteFile(file.path, file.sha)
    if (!delResult.ok) return delResult
  }
  return { ok: true }
}

export async function getRepoTree(): Promise<{ path: string; type: string; sha: string }[]> {
  const result = await safeJsonFetch(`${BASE_URL}/git/trees/main?recursive=1`, {
    headers: { Accept: 'application/vnd.github.v3+json', ...authHeaders() },
  })
  if (!result.ok) return []
  return (result.data as { tree: { path: string; type: string; sha: string }[] }).tree || []
}
