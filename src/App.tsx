import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext, useCallback } from 'react'
import { getSession, clearSession, type AppUser } from './lib/auth'
import { getTopics } from './lib/github'
import Login from './pages/Login'
import Topics from './pages/Topics'
import TopicDocs from './pages/TopicDocs'
import DocView from './pages/DocView'
import NewTopic from './pages/NewTopic'
import NewDoc from './pages/NewDoc'
import Layout from './components/Layout'
import { ToastProvider } from './components/Toast'
import type { Topic } from './types'

interface AuthContextType {
  user: AppUser | null
  setUser: (user: AppUser | null) => void
}

interface TopicsContextType {
  topics: Topic[]
  addTopic: (name: string) => void
  removeTopic: (name: string) => void
  renameTopicInContext: (oldName: string, newName: string) => void
  loadTopics: () => void
}

export const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {} })
export const TopicsContext = createContext<TopicsContextType>({ topics: [], addTopic: () => {}, removeTopic: () => {}, renameTopicInContext: () => {}, loadTopics: () => {} })

export function useAuth() {
  return useContext(AuthContext)
}

export function useTopics() {
  return useContext(TopicsContext)
}

function App() {
  const [user, setUser] = useState<AppUser | null>(() => {
    const session = getSession()
    if (!session) return null
    return { id: session.id, username: session.username, password: '' }
  })

  const [topics, setTopics] = useState<Topic[]>([])

  const addTopic = useCallback((name: string) => {
    setTopics(prev => [...prev, { name, path: `topicos/${name}`, docs: [] }])
  }, [])

  const removeTopic = useCallback((name: string) => {
    setTopics(prev => prev.filter(t => t.name !== name))
  }, [])

  const renameTopicInContext = useCallback((oldName: string, newName: string) => {
    setTopics(prev => prev.map(t => t.name === oldName ? { ...t, name: newName, path: `topicos/${newName}` } : t))
  }, [])

  const loadTopics = useCallback(() => {
    getTopics().then(setTopics).catch(() => {})
  }, [])

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={setUser} />} />
      </Routes>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <TopicsContext.Provider value={{ topics, addTopic, removeTopic, renameTopicInContext, loadTopics }}>
        <ToastProvider>
          <Layout onLogout={() => { clearSession(); setUser(null) }}>
            <Routes>
              <Route path="/" element={<Topics />} />
              <Route path="/topico/:topicName" element={<TopicDocs />} />
              <Route path="/topico/:topicName/:docName" element={<DocView />} />
              <Route path="/novo-topico" element={<NewTopic />} />
            <Route path="/topico/:topicName/novo-doc" element={<NewDoc />} />
            <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </TopicsContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
