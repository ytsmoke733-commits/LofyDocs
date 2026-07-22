import { NavLink } from 'react-router-dom'
import { ReactNode, useState } from 'react'
import { useAuth, useTopics } from '../App'

interface LayoutProps {
  children: ReactNode
  onLogout: () => void
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const { user } = useAuth()
  const { topics } = useTopics()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="layout">
      <button className={`menu-toggle${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`sidebar-overlay${menuOpen ? ' visible' : ''}`} onClick={closeMenu} />
      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <h2>LofyDocs <span style={{ fontSize: 11, color: '#7a7298', fontWeight: 400 }}>v1.0</span></h2>
        <nav onClick={closeMenu}>
          <div className="section-title">Navegação</div>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
            Tópicos
          </NavLink>
          <NavLink to="/novo-topico" className={({ isActive }) => isActive ? 'active' : ''}>
            + Novo Tópico
          </NavLink>
        </nav>
        {topics.length > 0 && (
          <nav onClick={closeMenu}>
            <div className="section-title">Tópicos</div>
            {topics.map(t => (
              <NavLink
                key={t.path}
                to={`/topico/${encodeURIComponent(t.name)}`}
                className={({ isActive }) => `topic-link${isActive ? ' active' : ''}`}
              >
                {t.name}
              </NavLink>
            ))}
          </nav>
        )}
        <div className="user-status">
          <div className="user-name">{user?.username || 'Desconhecido'}</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <span style={{ fontSize: 10, background: '#7c3aed22', color: '#a855f7', padding: '1px 6px', borderRadius: 4 }}>
              ID: {user?.id}
            </span>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Sair
        </button>
      </aside>
      <main className="content" onClick={menuOpen ? closeMenu : undefined}>
        {children}
      </main>
    </div>
  )
}
