export interface GitHubContent {
  type: string
  name: string
  path: string
  sha: string
  content?: string
  size?: number
}

export interface Topic {
  name: string
  path: string
  docs: DocSummary[]
}

export interface DocSummary {
  name: string
  path: string
  title: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface InitRequest {
  app_id: string
  key: string
  hwid: string
  version?: string
  binary_hash?: string
}

export interface InitData {
  session_token: string
  expires_at: string
  is_new: boolean
  level: number
  expires_in_days: number | null
}