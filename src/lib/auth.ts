export interface AppUser {
  id: string
  username: string
  password: string
}

const USERS: AppUser[] = [
  { id: 'user-smoke', username: 'Smoke', password: '@Zsmoke1212' },
  { id: 'user-light', username: 'Light', password: '@Light1212' },
]

export function authenticate(username: string, password: string): AppUser | null {
  return USERS.find(u => u.username === username && u.password === password) ?? null
}

export function getUserById(id: string): AppUser | undefined {
  return USERS.find(u => u.id === id)
}

export function getUserByUsername(username: string): AppUser | undefined {
  return USERS.find(u => u.username === username)
}

const STORAGE_KEY = 'lofydocs_user'

export function saveSession(user: AppUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: user.id, username: user.username }))
}

export function getSession(): { id: string; username: string } | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
